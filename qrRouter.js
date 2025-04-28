// backend/routes/qrRouter.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// POST /qr/redeem { code, uid }
router.post('/redeem', async (req, res) => {
  const { code, uid } = req.body;

  if (!code || !uid) {
    return res.status(400).json({ error: 'Code and UID are required.' });
  }

  try {
    const db = admin.firestore();
    const qrRef = db.collection('qrCodes').doc(code);
    const qrDoc = await qrRef.get();

    if (!qrDoc.exists) {
      return res.status(404).json({ error: 'QR code not found.' });
    }

    const data = qrDoc.data();

    if (data.redeemed) {
      return res.status(403).json({ error: 'QR code already redeemed.' });
    }

    // Update QR code with user info and flag as redeemed
    await qrRef.update({
      redeemed: true,
      uid,
      redeemedAt: Date.now()
    });

    res.json({ success: true, code, uid });
  } catch (err) {
  console.error('QR redemption error:', err.message);
}
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;