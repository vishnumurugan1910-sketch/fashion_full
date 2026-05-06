const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  orderId: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String },
  userEmail: { type: String },
  product: { type: String },
  productImage: { type: String },
  type: { type: String, enum: ['return', 'exchange'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'processing', 'completed'], default: 'pending' },
  reason: { type: String, required: true },
  reasonCategory: { type: String },
  description: { type: String },
  refundAmount: { type: Number, default: 0 },
  refundStatus: { type: String, enum: ['none', 'processing', 'completed'], default: 'none' },
  exchangeSize: { type: String },
  exchangeColor: { type: String },
  replacementId: { type: String },
  trackingNumber: { type: String },
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

returnSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Return', returnSchema);