require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevation');

  const adminRole = await Role.findOne({ name: 'Admin' });
  
  const admin = {
    name: 'Admin',
    email: 'admin@elevation.com',
    password: 'admin123',
    phone: '+919999999999',
    role: 'admin',
    roleId: adminRole?._id,
    status: 'active',
  };

  const existing = await User.findOne({ email: admin.email });
  if (existing) {
    console.log('Admin user already exists');
  } else {
    await User.create(admin);
    console.log('Admin user created');
  }
  
  process.exit(0);
}

seedAdmin().catch(console.error);