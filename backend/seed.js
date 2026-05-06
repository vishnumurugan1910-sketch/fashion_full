require('dotenv').config();
const mongoose = require('mongoose');

const Product = require('./models/Product');
const Category = require('./models/Category');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/elevation';

const categories = [
  {
    name: 'Women',
    slug: 'women',
    description: 'Elegance Redefined',
    banner: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1600&q=80',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
    isActive: true,
    featured: true,
    order: 1,
    productCount: 0
  },
  {
    name: 'Men',
    slug: 'men',
    description: 'Modern Sophistication',
    banner: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    isActive: true,
    featured: true,
    order: 2,
    productCount: 0
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Statement Pieces',
    banner: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1600&q=80',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
    isActive: true,
    featured: true,
    order: 3,
    productCount: 0
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    description: 'Step Into Style',
    banner: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1600&q=80',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    isActive: true,
    featured: true,
    order: 4,
    productCount: 0
  }
];

const products = [
  {
    name: 'Silk Draped Evening Gown',
    brand: 'Valentino',
    category: 'women',
    price: 42999,
    originalPrice: 64999,
    stock: 15,
    totalStock: 15,
    lowStockThreshold: 5,
    costPrice: 25000,
    warehouseLocation: 'Rack-A-01',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80'
    ],
    description: 'An exquisite silk evening gown featuring hand-embellished crystal bodice.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Black', hex: '#0a0a0a' },
      { name: 'Champagne Gold', hex: '#c9a96e' }
    ],
    stockByVariant: [
      { size: 'XS', color: 'Midnight Black', quantity: 3, reserved: 0 },
      { size: 'S', color: 'Midnight Black', quantity: 3, reserved: 1 },
      { size: 'M', color: 'Midnight Black', quantity: 2, reserved: 0 },
      { size: 'L', color: 'Midnight Black', quantity: 2, reserved: 0 },
      { size: 'XL', color: 'Midnight Black', quantity: 1, reserved: 0 },
      { size: 'S', color: 'Champagne Gold', quantity: 2, reserved: 0 },
      { size: 'M', color: 'Champagne Gold', quantity: 2, reserved: 0 },
    ],
    details: ['100% Mulberry Silk', 'Hand-embellished crystals', 'Made in Italy']
  },
  {
    name: 'Tailored Wool Overcoat',
    brand: 'Zara Studio',
    category: 'men',
    price: 12499,
    originalPrice: 18999,
    stock: 20,
    totalStock: 20,
    lowStockThreshold: 5,
    costPrice: 6000,
    warehouseLocation: 'Rack-B-03',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80'
    ],
    description: 'A timeless tailored overcoat in premium wool blend.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#c19a6b' },
      { name: 'Charcoal', hex: '#36454f' }
    ],
    stockByVariant: [
      { size: 'S', color: 'Camel', quantity: 5, reserved: 0 },
      { size: 'M', color: 'Camel', quantity: 5, reserved: 1 },
      { size: 'L', color: 'Camel', quantity: 5, reserved: 0 },
      { size: 'XL', color: 'Camel', quantity: 3, reserved: 0 },
      { size: 'S', color: 'Charcoal', quantity: 1, reserved: 0 },
      { size: 'M', color: 'Charcoal', quantity: 1, reserved: 0 },
    ],
    details: ['80% Wool, 20% Cashmere', 'Fully lined', 'Dry clean recommended']
  },
  {
    name: 'Leather Crossbody Bag',
    brand: 'Hermès',
    category: 'accessories',
    price: 89999,
    originalPrice: 120000,
    stock: 3,
    totalStock: 3,
    lowStockThreshold: 5,
    costPrice: 45000,
    warehouseLocation: 'Rack-C-02',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'
    ],
    description: 'Luxurious leather crossbody bag with signature gold hardware.',
    sizes: ['One Size'],
    colors: [
      { name: 'Noir', hex: '#0a0a0a' },
      { name: 'Rouge', hex: '#8b0000' }
    ],
    stockByVariant: [
      { size: 'One Size', color: 'Noir', quantity: 2, reserved: 0 },
      { size: 'One Size', color: 'Rouge', quantity: 1, reserved: 0 },
    ],
    details: ['100% Calfskin leather', 'Gold-plated hardware', 'Made in France']
  },
  {
    name: 'Crystal Embellished Heels',
    brand: 'Jimmy Choo',
    category: 'footwear',
    price: 75000,
    originalPrice: 99000,
    stock: 0,
    totalStock: 0,
    lowStockThreshold: 3,
    costPrice: 35000,
    warehouseLocation: 'Rack-D-01',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80'
    ],
    description: 'Stunning crystal embellished heels for special occasions.',
    sizes: ['35', '36', '37', '38', '39', '40'],
    colors: [
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Gold', hex: '#FFD700' }
    ],
    stockByVariant: [],
    details: ['Crystal embellishments', 'Leather sole', '4-inch heel']
  }
];

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing data');

    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    for (const cat of categories) {
      const count = products.filter(p => p.category === cat.slug).length;
      await Category.updateOne({ slug: cat.slug }, { productCount: count });
    }
    console.log('✅ Updated category product counts');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\nCategories:');
    insertedCategories.forEach(c => console.log(`  - /${c.slug} (${c.isActive ? 'Active' : 'Inactive'})`));
    console.log('\nProducts:');
    insertedProducts.forEach(p => console.log(`  - ${p.name} | Stock: ${p.stock} | Low Alert: ${p.lowStockThreshold} | Warehouse: ${p.warehouseLocation}`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();