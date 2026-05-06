require('dotenv').config();
const mongoose = require('mongoose');

const Return = require('./models/Return');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/elevation';

const returns = [
  {
    orderId: 'ORD-2026-001',
    userName: 'Priya Sharma',
    userEmail: 'priya@example.com',
    product: 'Silk Draped Evening Gown',
    productImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
    type: 'return',
    status: 'completed',
    reason: 'The size was too small',
    reasonCategory: 'Wrong Size',
    description: 'I ordered a size M but it doesn\'t fit. Would like to return for a refund.',
    refundAmount: 8500,
    refundStatus: 'completed',
    createdAt: new Date('2026-04-01'),
  },
  {
    orderId: 'ORD-2026-002',
    userName: 'Ananya Singh',
    userEmail: 'ananya@example.com',
    product: 'Leather Crossbody Bag',
    productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    type: 'exchange',
    status: 'processing',
    reason: 'Wrong color received',
    reasonCategory: 'Wrong Color',
    description: 'Received black but ordered brown. Would like to exchange.',
    exchangeSize: 'Medium',
    exchangeColor: 'Brown',
    createdAt: new Date('2026-04-05'),
  },
  {
    orderId: 'ORD-2026-003',
    userName: 'Arjun Mehta',
    userEmail: 'arjun@example.com',
    product: 'Tailored Wool Overcoat',
    productImage: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
    type: 'return',
    status: 'pending',
    reason: 'Found better price elsewhere',
    reasonCategory: 'Better Price Elsewhere',
    description: 'Found the same coat at 40% discount on another website.',
    refundAmount: 12000,
    refundStatus: 'none',
    createdAt: new Date('2026-04-10'),
  },
  {
    orderId: 'ORD-2026-004',
    userName: 'Meera Joshi',
    userEmail: 'meera@example.com',
    product: 'Classic Check Cashmere Scarf',
    productImage: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
    type: 'return',
    status: 'approved',
    reason: 'Product has a defect',
    reasonCategory: 'Defective Product',
    description: 'There are visible marks on the scarf. Quality issue.',
    refundAmount: 4500,
    refundStatus: 'none',
    createdAt: new Date('2026-04-08'),
  },
  {
    orderId: 'ORD-2026-005',
    userName: 'Rohan Kapoor',
    userEmail: 'rohan@example.com',
    product: 'Re-Nylon Cropped Jacket',
    productImage: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80',
    type: 'exchange',
    status: 'pending',
    reason: 'Want a different size',
    reasonCategory: 'Wrong Size',
    description: 'Would like to exchange for size L instead of M.',
    exchangeSize: 'Large',
    exchangeColor: 'Black',
    createdAt: new Date('2026-04-12'),
  },
  {
    orderId: 'ORD-2026-006',
    userName: 'Vikram Reddy',
    userEmail: 'vikram@example.com',
    product: 'Crystal Embellished Heels',
    productImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    type: 'return',
    status: 'rejected',
    reason: 'Changed mind',
    reasonCategory: 'Changed Mind',
    description: 'No longer need this product.',
    refundAmount: 6500,
    refundStatus: 'none',
    adminNotes: 'Cannot accept return as per policy - worn item',
    createdAt: new Date('2026-04-03'),
  },
  {
    orderId: 'ORD-2026-007',
    userName: 'Sana Khan',
    userEmail: 'sana@example.com',
    product: 'Oversized Structured Blazer',
    productImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    type: 'return',
    status: 'processing',
    reason: 'Not as described',
    reasonCategory: 'Not as Described',
    description: 'The fabric looks different from the website photos.',
    refundAmount: 7500,
    refundStatus: 'processing',
    createdAt: new Date('2026-04-11'),
  },
  {
    orderId: 'ORD-2026-008',
    userName: 'Neha Sharma',
    userEmail: 'neha@example.com',
    product: 'Silk Draped Evening Gown',
    productImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
    type: 'return',
    status: 'pending',
    reason: 'Wrong size fit',
    reasonCategory: 'Wrong Size',
    description: 'Need a larger size. Want to exchange for XL.',
    refundAmount: 0,
    exchangeSize: 'XL',
    createdAt: new Date('2026-04-15'),
  },
];

async function seedReturns() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    console.log('🗑️  Clearing existing returns...');
    await Return.deleteMany({});
    console.log('✅ Returns cleared\n');

    console.log('📦 Seeding returns...');
    const insertedReturns = await Return.insertMany(returns);
    console.log(`✅ Inserted ${insertedReturns.length} returns\n`);

    console.log('========================================');
    console.log('🎉 RETURNS SEED COMPLETED!');
    console.log('========================================\n');
    
    console.log('📊 SUMMARY:');
    console.log(`   Total: ${insertedReturns.length}`);
    console.log(`   Returns: ${insertedReturns.filter(r => r.type === 'return').length}`);
    console.log(`   Exchanges: ${insertedReturns.filter(r => r.type === 'exchange').length}`);
    console.log(`   Pending: ${insertedReturns.filter(r => r.status === 'pending').length}`);
    console.log(`   Completed: ${insertedReturns.filter(r => r.status === 'completed').length}\n`);

    console.log('📝 SAMPLE RETURNS:');
    insertedReturns.forEach(r => {
      console.log(`   - ${r.type.toUpperCase()} ${r.product} by ${r.userName} [${r.status}]`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedReturns();