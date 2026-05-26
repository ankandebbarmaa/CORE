require('dotenv').config();

module.exports = {
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  MONGODB_URI: process.env.MONGODB_URI || '',
  PORT: process.env.PORT || 4000,
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    API_KEY: process.env.CLOUDINARY_API_KEY || '',
    API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  },
};
