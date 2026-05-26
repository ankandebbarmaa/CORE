const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
    shippingDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    deliveryPoint: { type: mongoose.Schema.Types.Mixed, default: {} },
    subtotal: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, default: 'Placed' },
    location: { type: String, default: 'WAREHOUSE DEPOT' },
    eta: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    steps: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Order', orderSchema);