const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: String,
  hex: String,
}, { _id: false });

const stockByVariantSchema = new mongoose.Schema({
  size: String,
  color: String,
  quantity: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  sku: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  stock: { type: Number, default: 0 },
  totalStock: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 5 },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' },
  image: { type: String },
  images: [{ type: String }],
  sizes: [{ type: String }],
  colors: [variantSchema],
  stockByVariant: [stockByVariantSchema],
  description: { type: String },
  details: [{ type: String }],
  warehouseLocation: { type: String },
  costPrice: { type: Number },
  lastRestocked: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (!this.sku) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.sku = `ELE-${timestamp}-${random}`;
  }
  if (this.stockByVariant && this.stockByVariant.length > 0) {
    this.totalStock = this.stockByVariant.reduce((sum, v) => sum + v.quantity, 0);
    this.stock = this.totalStock;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);