require('dotenv').config();
const mongoose = require('mongoose');
const SeoSettings = require('./models/SeoSettings');
const Blog = require('./models/Blog');

async function seedSeo() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevation');

  await SeoSettings.deleteMany({});
  await Blog.deleteMany({});

  const seoData = [
    {
      page: 'home',
      metaTitle: 'ÉLÉVATION | Premium Fashion & Clothing',
      metaDescription: 'Discover premium fashion at ÉLÉVATION. Shop the latest trends in clothing, accessories, and designer wear.',
      urlSlug: '/',
      keywords: ['fashion', 'clothing', 'premium wear', 'designer'],
      isActive: true,
      schema: { type: 'Website', data: { name: 'ÉLÉVATION' } },
    },
    {
      page: 'shop',
      metaTitle: 'Shop All Products | ÉLÉVATION',
      metaDescription: 'Browse our complete collection of premium fashion. Find the perfect outfit for any occasion.',
      urlSlug: '/shop',
      keywords: ['shop', 'buy clothing', 'fashion store'],
      isActive: true,
      schema: { type: 'Product', data: {} },
    },
    {
      page: 'about',
      metaTitle: 'About Us | ÉLÉVATION',
      metaDescription: 'Learn about ÉLÉVATION - premium fashion brand dedicated to elegance and style.',
      urlSlug: '/about',
      keywords: ['about', 'brand story', 'elevation fashion'],
      isActive: true,
      schema: { type: 'Organization', data: {} },
    },
    {
      page: 'contact',
      metaTitle: 'Contact Us | ÉLÉVATION',
      metaDescription: 'Get in touch with ÉLÉVATION. We are here to help with any questions.',
      urlSlug: '/contact',
      keywords: ['contact', 'customer support', 'help'],
      isActive: true,
      schema: { type: 'Organization', data: {} },
    },
    {
      page: 'blog',
      metaTitle: 'Blog | ÉLÉVATION Fashion',
      metaDescription: 'Latest fashion trends, style tips, and more from ÉLÉVATION.',
      urlSlug: '/blog',
      keywords: ['blog', 'fashion tips', 'style guide'],
      isActive: true,
      schema: { type: 'BlogPosting', data: {} },
    },
  ];

  const blogData = [
    {
      title: 'Summer Fashion Trends 2024',
      slug: 'summer-fashion-trends-2024',
      excerpt: 'Discover the hottest summer fashion trends that are taking over this season.',
      content: 'Summer 2024 brings exciting new trends to the fashion world. From pastel colors to sustainable fabrics, this season is all about comfort meets style.',
      category: 'Trends',
      tags: ['summer', 'trends', '2024'],
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'How to Build a Capsule Wardrobe',
      slug: 'build-capsule-wardrobe',
      excerpt: 'Learn the essentials of creating a versatile capsule wardrobe that works for any occasion.',
      content: 'A capsule wardrobe is the key to simplifying your style while always looking put-together. Here are the must-have pieces every wardrobe needs.',
      category: 'Style Guide',
      tags: ['wardrobe', 'essentials', 'style'],
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
    },
  ];

  await SeoSettings.insertMany(seoData);
  await Blog.insertMany(blogData);

  console.log('Seeded SEO settings and blog posts');
  process.exit(0);
}

seedSeo().catch(console.error);