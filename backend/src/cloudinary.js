const { v2: cloudinary } = require('cloudinary');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

const uploadImage = async (image, options = {}) => {
  if (!image) return image;
  if (!isCloudinaryConfigured) return image;
  if (/^https?:\/\//i.test(image)) return image;

  const uploadResult = await cloudinary.uploader.upload(image, {
    folder: options.folder || 'core/products',
    resource_type: 'image',
  });

  return uploadResult.secure_url || uploadResult.url || image;
};

module.exports = {
  cloudinary,
  uploadImage,
  isCloudinaryConfigured,
};