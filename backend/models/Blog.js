const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  author: { type: String, default: 'ÉLÉVATION' },
  category: { type: String, default: 'Fashion' },
  tags: [String],
  image: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  seo: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: [String],
  },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);