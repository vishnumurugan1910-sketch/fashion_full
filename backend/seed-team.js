require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');

async function seedTeam() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevation');

  const productManager = await Role.findOne({ name: 'Product Manager' });
  const orderManager = await Role.findOne({ name: 'Order Manager' });
  const support = await Role.findOne({ name: 'Customer Support' });
  const marketing = await Role.findOne({ name: 'Marketing' });

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      email: 'sarah@elevation.com',
      password: 'password123',
      phone: '+919988887777',
      role: 'admin',
      roleId: productManager?._id,
      status: 'active',
    },
    {
      name: 'Mike Chen',
      email: 'mike@elevation.com',
      password: 'password123',
      phone: '+919977776666',
      role: 'admin',
      roleId: orderManager?._id,
      status: 'active',
    },
    {
      name: 'Priya Sharma',
      email: 'priya@elevation.com',
      password: 'password123',
      phone: '+919966665555',
      role: 'admin',
      roleId: support?._id,
      status: 'active',
    },
    {
      name: 'Alex Kumar',
      email: 'alex@elevation.com',
      password: 'password123',
      phone: '+919955554444',
      role: 'admin',
      roleId: marketing?._id,
      status: 'active',
    },
  ];

  for (const member of teamMembers) {
    const existing = await User.findOne({ email: member.email });
    if (!existing) {
      await User.create(member);
      console.log(`Created: ${member.name}`);
    } else {
      console.log(`Exists: ${member.name}`);
    }
  }

  console.log('Team seeded!');
  process.exit(0);
}

seedTeam().catch(console.error);