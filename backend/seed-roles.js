require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('./models/Role');

async function seedRoles() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevation');
  await Role.deleteMany({});

  const roles = [
    {
      name: 'Admin',
      description: 'Full system access',
      permissions: [
        { resource: 'products', actions: ['view', 'create', 'edit', 'delete'] },
        { resource: 'inventory', actions: ['view', 'edit'] },
        { resource: 'categories', actions: ['view', 'create', 'edit', 'delete'] },
        { resource: 'orders', actions: ['view', 'edit', 'delete'] },
        { resource: 'customers', actions: ['view', 'edit'] },
        { resource: 'reviews', actions: ['view', 'edit', 'delete'] },
        { resource: 'returns', actions: ['view', 'edit'] },
        { resource: 'banners', actions: ['view', 'create', 'edit', 'delete'] },
        { resource: 'stories', actions: ['view', 'create', 'edit', 'delete'] },
        { resource: 'seo', actions: ['view', 'edit'] },
        { resource: 'blog', actions: ['view', 'create', 'edit', 'delete'] },
        { resource: 'roles', actions: ['view', 'create', 'edit', 'delete'] },
      ],
      isDefault: false,
      isActive: true,
      color: '#ef4444',
    },
    {
      name: 'Product Manager',
      description: 'Manage products and inventory',
      permissions: [
        { resource: 'products', actions: ['view', 'create', 'edit'] },
        { resource: 'inventory', actions: ['view', 'edit'] },
        { resource: 'categories', actions: ['view', 'create', 'edit'] },
        { resource: 'reviews', actions: ['view'] },
      ],
      isDefault: false,
      isActive: true,
      color: '#22c55e',
    },
    {
      name: 'Order Manager',
      description: 'Handle orders and returns',
      permissions: [
        { resource: 'orders', actions: ['view', 'edit'] },
        { resource: 'customers', actions: ['view'] },
        { resource: 'returns', actions: ['view', 'edit'] },
      ],
      isDefault: false,
      isActive: true,
      color: '#3b82f6',
    },
    {
      name: 'Customer Support',
      description: 'Customer assistance',
      permissions: [
        { resource: 'orders', actions: ['view'] },
        { resource: 'customers', actions: ['view', 'edit'] },
        { resource: 'returns', actions: ['view', 'edit'] },
        { resource: 'reviews', actions: ['view'] },
      ],
      isDefault: false,
      isActive: true,
      color: '#a855f7',
    },
    {
      name: 'Marketing',
      description: 'Content and marketing',
      permissions: [
        { resource: 'banners', actions: ['view', 'create', 'edit', 'delete'] },
        { resource: 'stories', actions: ['view', 'create', 'edit', 'delete'] },
        { resource: 'seo', actions: ['view', 'edit'] },
        { resource: 'blog', actions: ['view', 'create', 'edit', 'delete'] },
      ],
      isDefault: false,
      isActive: true,
      color: '#f97316',
    },
  ];

  await Role.insertMany(roles);
  console.log('Seeded roles');
  process.exit(0);
}

seedRoles().catch(console.error);