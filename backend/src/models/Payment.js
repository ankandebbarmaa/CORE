const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, ref: 'Order', index: true },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentMethod: { type: String, required: true }, // e.g. 'UPI', 'Credit Card', 'NetBanking', 'COD'
    status: { type: String, default: 'Success', enum: ['Pending', 'Success', 'Failed', 'Refunded'] },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Payment', paymentSchema);
