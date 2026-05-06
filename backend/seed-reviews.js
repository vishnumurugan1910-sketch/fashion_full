require('dotenv').config();
const mongoose = require('mongoose');

const Review = require('./models/Review');
const Product = require('./models/Product');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/elevation';

const reviews = [
  {
    productName: 'Silk Draped Evening Gown',
    productImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=60',
    rating: 5,
    comment: 'Absolutely stunning! The quality is exceptional and fits perfectly. Worth every penny. I wore this to a gala and received so many compliments.',
    status: 'approved',
    isSpam: false,
    isFeatured: true,
    customerPhotos: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80'
    ],
    helpfulCount: 24,
    date: '2026-04-05'
  },
  {
    productName: 'Leather Crossbody Bag',
    productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    userName: 'Ananya Singh',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=60',
    rating: 4,
    comment: 'Beautiful leather and excellent craftsmanship. The size is perfect for daily use. Only wish it had a bit more compartments.',
    status: 'approved',
    isSpam: false,
    isFeatured: true,
    customerPhotos: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80'
    ],
    helpfulCount: 18,
    date: '2026-04-03'
  },
  {
    productName: 'Tailored Wool Overcoat',
    productImage: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
    userName: 'Arjun Mehta',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=60',
    rating: 5,
    comment: 'Superb quality and warm enough for winter. Classic style that never goes out of fashion. Best investment piece!',
    status: 'approved',
    isSpam: false,
    isFeatured: false,
    helpfulCount: 12,
    date: '2026-04-01'
  },
  {
    productName: 'Classic Check Cashmere Scarf',
    productImage: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
    userName: 'Meera Joshi',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=60',
    rating: 3,
    comment: 'Soft and cozy but expected better quality for this price point. Color was slightly different from the website.',
    status: 'pending',
    isSpam: false,
    isFeatured: false,
    helpfulCount: 5,
    date: '2026-03-28'
  },
  {
    productName: 'Re-Nylon Cropped Jacket',
    productImage: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80',
    userName: 'Rohan Kapoor',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=60',
    rating: 4,
    comment: 'Great fit and stylish. Slightly tight around shoulders but overall satisfied.',
    status: 'approved',
    isSpam: false,
    isFeatured: false,
    customerPhotos: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&q=80'
    ],
    helpfulCount: 8,
    date: '2026-03-25'
  },
  {
    productName: 'Floral Print Midi Dress',
    productImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    userName: 'Vikram Reddy',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=60',
    rating: 2,
    comment: 'Color was different from the website. Fabric also felt cheaper than expected. Very disappointed with the quality.',
    status: 'rejected',
    isSpam: false,
    isFeatured: false,
    helpfulCount: 15,
    date: '2026-03-20'
  },
  {
    productName: 'Crystal Embellished Heels',
    productImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    userName: 'Sana Khan',
    userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab18903f95?w=100&q=60',
    rating: 5,
    comment: 'These heels are absolutely gorgeous! Comfortable enough to wear all day. The crystals catch the light beautifully.',
    status: 'approved',
    isSpam: false,
    isFeatured: true,
    customerPhotos: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80'
    ],
    helpfulCount: 22,
    date: '2026-03-18'
  },
  {
    productName: 'Oversized Structured Blazer',
    productImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    userName: 'Karan Malhotra',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-84589d73373c?w=100&q=60',
    rating: 4,
    comment: 'Great blazer for formal occasions. The oversized fit is very trendy. Material feels premium.',
    status: 'pending',
    isSpam: false,
    isFeatured: false,
    helpfulCount: 6,
    date: '2026-03-15'
  },
  {
    productName: 'Silk Draped Evening Gown',
    productImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
    userName: 'Fake User',
    userAvatar: 'https://example.com/fake.jpg',
    rating: 5,
    comment: 'BEST PRICE! Click here for cheap designer bags! http://spam.com',
    status: 'pending',
    isSpam: true,
    isFeatured: false,
    helpfulCount: 0,
    date: '2026-04-10'
  },
  {
    productName: 'Leather Crossbody Bag',
    productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    userName: 'Neha Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-04dda69a64a8?w=100&q=60',
    rating: 5,
    comment: 'Perfect everyday bag! The quality is amazing and it goes with everything. Already getting ready to buy another color.',
    status: 'approved',
    isSpam: false,
    isFeatured: true,
    customerPhotos: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&q=80'
    ],
    helpfulCount: 30,
    date: '2026-04-08'
  }
];

async function seedReviews() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing reviews
    console.log('🗑️  Clearing existing reviews...');
    await Review.deleteMany({});
    console.log('✅ Reviews cleared\n');

    // Get products for linking
    const products = await Product.find().limit(5);
    const productMap = {};
    products.forEach(p => {
      productMap[p.name] = p._id;
    });

    // Insert reviews with linked products
    const reviewsWithProducts = reviews.map(r => ({
      ...r,
      product: productMap[r.productName] || null
    }));

    console.log('⭐  Seeding reviews...');
    const insertedReviews = await Review.insertMany(reviewsWithProducts);
    console.log(`✅ Inserted ${insertedReviews.length} reviews\n`);

    // Print Summary
    console.log('========================================');
    console.log('🎉 REVIEWS SEED COMPLETED!');
    console.log('========================================\n');
    
    console.log('📊 SUMMARY:');
    console.log(`   Total: ${insertedReviews.length}`);
    console.log(`   Approved: ${insertedReviews.filter(r => r.status === 'approved').length}`);
    console.log(`   Pending: ${insertedReviews.filter(r => r.status === 'pending').length}`);
    console.log(`   Rejected: ${insertedReviews.filter(r => r.status === 'rejected').length}`);
    console.log(`   Spam: ${insertedReviews.filter(r => r.isSpam).length}`);
    console.log(`   Featured: ${insertedReviews.filter(r => r.isFeatured).length}\n`);

    console.log('📝 SAMPLE REVIEWS:');
    insertedReviews.forEach(r => {
      console.log(`   - ${r.rating}★ ${r.productName} by ${r.userName} [${r.status}]${r.isSpam ? ' [SPAM]' : ''}${r.isFeatured ? ' [FEATURED]' : ''}`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

seedReviews();