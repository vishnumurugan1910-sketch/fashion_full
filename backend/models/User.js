const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  street: String,
  city: String,
  state: String,
  pincode: String,
  phone: String,
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const purchaseHistorySchema = new mongoose.Schema({
  orderId: { type: String },
  orderDate: { type: Date },
  total: { type: Number },
  status: { type: String },
  items: { type: Number }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  password: { type: String },
  provider: { type: String, enum: ['email', 'google', 'whatsapp'], default: 'email' },
  role: { type: String, default: 'user' },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  orders: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  joined: { type: Date, default: Date.now },
  lastOrderDate: { type: Date },
  addresses: [addressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  purchaseHistory: [purchaseHistorySchema],
  notes: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);