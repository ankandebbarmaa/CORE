const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { uploadImage, isCloudinaryConfigured } = require('../cloudinary');

router.post('/image', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { image } = req.body ?? {};
    if (!image) return res.status(400).json({ message: 'Missing image payload' });

    const url = await uploadImage(image, { folder: 'core/products' });
    res.status(201).json({ url, provider: isCloudinaryConfigured ? 'cloudinary' : 'local' });
  } catch (error) {
    console.error('Failed to upload image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

module.exports = router;
