const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    id: String,
    user: String,
    rating: Number,
    comment: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    category: { type: String, required: true },
    gender: { type: String, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    description: { type: String, default: '' },
    reviews: { type: [reviewSchema], default: [] },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    isNewArrival: { type: Boolean, default: false },
    collection: { type: String, default: 'core essentials' },
    
    // Shopify-grade product details
    compareAtPrice: Number,
    costPerItem: Number,
    chargeTax: { type: Boolean, default: true },
    sku: { type: String, default: '' },
    barcode: { type: String, default: '' },
    trackInventory: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    weightUnit: { type: String, default: 'kg' },
    vendor: { type: String, default: '' },
    productType: { type: String, default: '' },
    tags: { type: [String], default: [] },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Product', productSchema);