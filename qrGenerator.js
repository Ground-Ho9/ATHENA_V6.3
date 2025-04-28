import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import archiver from 'archiver';
import path from 'path';

export const generateQRCodes = async (count = 10, type = 'account_activation') => {
  const codes = [];
  const outputDir = './output_qrs';

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (let i = 0; i < count; i++) {
    const codeId = uuidv4();
    const payload = { codeId, type, used: false };
    const qrData = JSON.stringify(payload);
    const filePath = path.join(outputDir, `${codeId}.svg`);

    await QRCode.toFile(filePath, qrData, { type: 'svg' });
    codes.push(payload);
  }

  // Write JSON ledger
  fs.writeFileSync(
    path.join(outputDir, 'qr_codes.json'),
    JSON.stringify(codes, null, 2)
  );

  // Write CSV manifest
  const csvLines = ['codeId,type'];
  codes.forEach(code => {
    csvLines.push(`${code.codeId},${code.type}`);
  });
  fs.writeFileSync(
    path.join(outputDir, 'qr_codes.csv'),
    csvLines.join('\n')
  );

  // Create ZIP archive
  const zipPath = path.join(outputDir, 'qr_batch.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
  console.log(`${archive.pointer()} total bytes written to ${zipPath}`);
}
      resolve();
    });

    archive.on('error', err => reject(err));

    archive.pipe(output);
    archive.directory(outputDir, false);
    archive.finalize();
  });
};
