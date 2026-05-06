require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');

// Add provider field to schema if missing
const userSchema = User.schema;
if (!userSchema.obj.provider) {
  userSchema.add({ provider: { type: String, enum: ['email', 'google', 'whatsapp'], default: 'email' } });
}

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/elevation';

const customers = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 9876543210',
    provider: 'email',
    role: 'user',
    status: 'active',
    orders: 3,
    totalSpent: 118497,
    loyaltyPoints: 1185,
    joined: new Date('2024-01-15'),
    lastOrderDate: new Date('2024-06-10'),
    addresses: [
      { label: 'Home', street: '123 Fashion Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 9876543210', isDefault: true },
      { label: 'Office', street: '456 Business Park', city: 'Mumbai', state: 'Maharashtra', pincode: '400012', phone: '+91 9876543211', isDefault: false },
    ],
    purchaseHistory: [
      { orderId: 'ORD-001', orderDate: new Date('2024-06-10'), total: 42999, status: 'Delivered', items: 1 },
      { orderId: 'ORD-002', orderDate: new Date('2024-04-05'), total: 25498, status: 'Delivered', items: 2 },
      { orderId: 'ORD-003', orderDate: new Date('2024-01-15'), total: 50000, status: 'Delivered', items: 1 },
    ],
    tags: ['VIP', 'Frequent Buyer'],
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@email.com',
    phone: '+91 9876543211',
    status: 'active',
    orders: 1,
    totalSpent: 25498,
    loyaltyPoints: 255,
    joined: new Date('2024-05-20'),
    lastOrderDate: new Date('2024-05-20'),
    addresses: [
      { label: 'Home', street: '789 Style Avenue', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 9876543211', isDefault: true },
    ],
    purchaseHistory: [
      { orderId: 'ORD-004', orderDate: new Date('2024-05-20'), total: 25498, status: 'Delivered', items: 2 },
    ],
    tags: ['New Customer'],
  },
  {
    name: 'Ananya Singh',
    email: 'ananya.singh@email.com',
    phone: '+91 9876543212',
    status: 'active',
    orders: 5,
    totalSpent: 245000,
    loyaltyPoints: 2450,
    joined: new Date('2023-08-10'),
    lastOrderDate: new Date('2024-07-15'),
    addresses: [
      { label: 'Home', street: '321 Luxury Lane', city: 'Bangalore', state: 'Karnataka', pincode: '560001', phone: '+91 9876543212', isDefault: true },
    ],
    purchaseHistory: [
      { orderId: 'ORD-005', orderDate: new Date('2024-07-15'), total: 89999, status: 'Delivered', items: 1 },
      { orderId: 'ORD-006', orderDate: new Date('2024-05-10'), total: 75000, status: 'Delivered', items: 2 },
      { orderId: 'ORD-007', orderDate: new Date('2024-02-20'), total: 40000, status: 'Delivered', items: 3 },
      { orderId: 'ORD-008', orderDate: new Date('2023-12-05'), total: 25000, status: 'Delivered', items: 1 },
      { orderId: 'ORD-009', orderDate: new Date('2023-08-10'), total: 15001, status: 'Delivered', items: 2 },
    ],
    tags: ['VIP', 'Premium'],
  },
  {
    name: 'Rohan Kapoor',
    email: 'rohan.kapoor@email.com',
    phone: '+91 9876543213',
    status: 'inactive',
    orders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    joined: new Date('2024-03-01'),
    addresses: [],
    purchaseHistory: [],
    tags: [],
  },
  {
    name: 'Meera Joshi',
    email: 'meera.joshi@email.com',
    phone: '+91 9876543214',
    status: 'active',
    orders: 2,
    totalSpent: 78497,
    loyaltyPoints: 785,
    joined: new Date('2024-02-28'),
    lastOrderDate: new Date('2024-06-25'),
    addresses: [
      { label: 'Home', street: '555 Premium Plaza', city: 'Hyderabad', state: 'Telangana', pincode: '500001', phone: '+91 9876543214', isDefault: true },
    ],
    purchaseHistory: [
      { orderId: 'ORD-010', orderDate: new Date('2024-06-25'), total: 53498, status: 'Delivered', items: 2 },
      { orderId: 'ORD-011', orderDate: new Date('2024-02-28'), total: 25000, status: 'Delivered', items: 1 },
    ],
    tags: ['Regular'],
  },
  {
    name: 'Vikram Reddy',
    email: 'vikram.reddy@email.com',
    phone: '+91 9876543215',
    status: 'active',
    orders: 4,
    totalSpent: 179998,
    loyaltyPoints: 1800,
    joined: new Date('2023-11-15'),
    lastOrderDate: new Date('2024-08-01'),
    addresses: [
      { label: 'Home', street: '777 Designer Drive', city: 'Pune', state: 'Maharashtra', pincode: '411001', phone: '+91 9876543215', isDefault: true },
      { label: 'Office', street: '888 Tech Park', city: 'Pune', state: 'Maharashtra', pincode: '411008', phone: '+91 9876543216', isDefault: false },
    ],
    purchaseHistory: [
      { orderId: 'ORD-012', orderDate: new Date('2024-08-01'), total: 79999, status: 'Delivered', items: 1 },
      { orderId: 'ORD-013', orderDate: new Date('2024-06-20'), total: 50000, status: 'Delivered', items: 2 },
      { orderId: 'ORD-014', orderDate: new Date('2024-03-15'), total: 25000, status: 'Delivered', items: 1 },
      { orderId: 'ORD-015', orderDate: new Date('2023-11-15'), total: 25000, status: 'Delivered', items: 1 },
    ],
    tags: ['VIP', 'Frequent Buyer'],
  },
];

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Update existing users to add provider field
    await User.updateMany(
      { provider: { $exists: false } },
      { $set: { provider: 'email' } }
    );
    console.log('🗑️ Updated existing users with provider: email');

    await User.deleteMany({ role: 'admin' });
    console.log('🗑️ Cleared admin users');

    await User.insertMany(customers);
    console.log(`✅ Inserted ${customers.length} customers`);

    console.log('\n🎉 Customer seed completed!');
    console.log('\nCustomers:');
    const users = await User.find({ role: 'user' }).limit(10);
    users.forEach(u => console.log(`  - ${u.name} | ${u.email} | ${u.provider} | ${u.orders} orders`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();