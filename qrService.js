// services/qrService.js
let qrCodeDatabase = require('../assets/qrcodes/qr_codes.json');
import firestore from '@react-native-firebase/firestore';

export const validateQRCode = async (scannedData, userId) => {
  try {
    const payload = JSON.parse(scannedData);
    const record = qrCodeDatabase.find(code => code.codeId === payload.codeId);

    if (!record) {
      return { success: false, message: 'Invalid code.' };
    }

    if (record.used) {
      return { success: false, message: 'Code already used.' };
    }

    // Link code to user and mark used
    record.used = true;
    record.userId = userId;

    await firestore().collection('qrRedemptions').doc(payload.codeId).set({
      ...record,
      timestamp: Date.now(),
    });

    return { success: true, message: 'QR code validated and linked to user.' };
  } catch (err) {
    return { success: false, message: 'QR parsing error.' };
  }
};