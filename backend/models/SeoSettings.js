const mongoose = require('mongoose');

const seoSettingsSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  urlSlug: { type: String, default: '' },
  keywords: [String],
  canonicalUrl: { type: String, default: '' },
  ogImage: { type: String, default: '' },
  jsonLd: {
    type: { type: String, default: 'Product' },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SeoSettings', seoSettingsSchema);