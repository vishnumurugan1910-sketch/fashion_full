require('dotenv').config();
const mongoose = require('mongoose');

const Order = require('./models/Order');
const Product = require('./models/Product');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/elevation';

const orders = [
  {
    orderId: 'ORD-TEST001',
    customer: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 9876543210',
    address: {
      street: '123 Fashion Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    items: [
      { name: 'Silk Draped Evening Gown', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200', price: 42999, quantity: 1, size: 'M', color: 'Midnight Black' },
    ],
    subtotal: 42999,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 42999,
    status: 'Pending',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    orderId: 'ORD-TEST002',
    customer: 'Arjun Mehta',
    email: 'arjun.mehta@email.com',
    phone: '+91 9876543211',
    address: {
      street: '456 Style Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India'
    },
    items: [
      { name: 'Tailored Wool Overcoat', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200', price: 12499, quantity: 2, size: 'L', color: 'Camel' },
    ],
    subtotal: 24998,
    shipping: 500,
    tax: 0,
    discount: 0,
    total: 25498,
    status: 'Processing',
    paymentStatus: 'paid',
    paymentMethod: 'Razorpay',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    orderId: 'ORD-TEST003',
    customer: 'Ananya Singh',
    email: 'ananya.singh@email.com',
    phone: '+91 9876543212',
    address: {
      street: '789 Luxury Lane',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    },
    items: [
      { name: 'Leather Crossbody Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200', price: 89999, quantity: 1, size: 'One Size', color: 'Noir' },
    ],
    subtotal: 89999,
    shipping: 0,
    tax: 0,
    discount: 5000,
    total: 84999,
    status: 'Packed',
    paymentStatus: 'paid',
    paymentMethod: 'Razorpay',
    trackingNumber: 'FED123456789',
    shippingCarrier: 'FedEx',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    orderId: 'ORD-TEST004',
    customer: 'Rohan Kapoor',
    email: 'rohan.kapoor@email.com',
    phone: '+91 9876543213',
    address: {
      street: '321 Elite Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      country: 'India'
    },
    items: [
      { name: 'Crystal Embellished Heels', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200', price: 75000, quantity: 1, size: '38', color: 'Silver' },
    ],
    subtotal: 75000,
    shipping: 200,
    tax: 0,
    discount: 0,
    total: 75200,
    status: 'Shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Razorpay',
    trackingNumber: 'DTDC987654321',
    shippingCarrier: 'DTDC',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    orderId: 'ORD-TEST005',
    customer: 'Meera Joshi',
    email: 'meera.joshi@email.com',
    phone: '+91 9876543214',
    address: {
      street: '654 Premium Plaza',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
      country: 'India'
    },
    items: [
      { name: 'Silk Draped Evening Gown', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200', price: 42999, quantity: 1, size: 'S', color: 'Champagne Gold' },
      { name: 'Tailored Wool Overcoat', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200', price: 12499, quantity: 1, size: 'M', color: 'Charcoal' },
    ],
    subtotal: 55498,
    shipping: 0,
    tax: 0,
    discount: 2000,
    total: 53498,
    status: 'Delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Razorpay',
    deliveredDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    orderId: 'ORD-TEST006',
    customer: 'Vikram Reddy',
    email: 'vikram.reddy@email.com',
    phone: '+91 9876543215',
    address: {
      street: '987 Designer Drive',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      country: 'India'
    },
    items: [
      { name: 'Leather Crossbody Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200', price: 89999, quantity: 1, size: 'One Size', color: 'Rouge' },
    ],
    subtotal: 89999,
    shipping: 0,
    tax: 0,
    discount: 10000,
    total: 79999,
    status: 'Cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'Razorpay',
    cancellationReason: 'Customer requested cancellation',
    cancelledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    await Order.deleteMany({});
    console.log('🗑️ Cleared existing orders');

    const insertedOrders = await Order.insertMany(orders);
    console.log(`✅ Inserted ${insertedOrders.length} orders`);

    console.log('\n🎉 Order seed completed!');
    console.log('\nOrders:');
    insertedOrders.forEach(o => console.log(`  - ${o.orderId} | ${o.customer} | ${o.status} | ₹${o.total}`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();