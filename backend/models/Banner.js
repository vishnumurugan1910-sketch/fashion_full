const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  image: { type: String },
  images: [{ type: String }],
  video: { type: String },
  ctaText: { type: String, default: 'Shop Now' },
  ctaLink: { type: String, default: '/' },
  secondCtaText: { type: String },
  secondCtaLink: { type: String },
  type: { 
    type: String, 
    enum: ['hero', 'promo', 'section', 'collection', 'campaign', 'newsletter', 'featured', 'trending'],
    default: 'hero' 
  },
  position: { type: Number, default: 0 },
  category: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  active: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  backgroundColor: { type: String },
  textColor: { type: String },
  layout: { type: String, enum: ['full', 'left', 'right', 'center', 'split'], default: 'full' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

bannerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Banner', bannerSchema);