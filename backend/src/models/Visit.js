const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    sessionId: String,
    visitorId: String,
    state: String,
    country: String,
    device: String,
    source: String,
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Visit', visitSchema);