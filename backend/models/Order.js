const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String },
  image: { type: String },
  price: { type: Number },
  originalPrice: { type: Number },
  quantity: { type: Number },
  size: { type: String },
  color: { type: String },
  sku: { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customer: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { 
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: { type: String },
  total: { type: Number, required: true },
  amount: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Pending' 
  },
  payment: { type: String },
  paymentMethod: { type: String },
  paymentId: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded', 'partial_refunded'], default: 'pending' },
  razorpayOrderId: { type: String },
  invoiceNumber: { type: String },
  invoiceDate: { type: Date },
  trackingNumber: { type: String },
  shippingCarrier: { type: String },
  shippedDate: { type: Date },
  deliveredDate: { type: Date },
  cancellationReason: { type: String },
  cancelledDate: { type: Date },
  returnReason: { type: String },
  returnDate: { type: Date },
  refundAmount: { type: Number },
  refundDate: { type: Date },
  refundMethod: { type: String, enum: ['original', 'bank_transfer', 'wallet'] },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  notes: { type: String },
  adminNotes: { type: String },
  date: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (!this.orderId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderId = `ORD-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);