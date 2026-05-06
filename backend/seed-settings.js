require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/Settings');

async function seedSettings() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevation');

  const existing = await Settings.findOne({ key: 'general' });
  if (existing) {
    console.log('Settings already exist');
    process.exit(0);
  }

  await Settings.create({
    key: 'general',
    payment: {
      razorpay: { keyId: '', keySecret: '', isActive: false },
      cod: { isActive: true, minimumOrder: 500, maximumOrder: 10000, charges: 50 },
      upi: { isActive: false, upiId: '' },
    },
    shipping: {
      freeShippingAbove: 999,
      defaultCharge: 99,
      expressCharge: 199,
      processingDays: 2,
      zones: [
        { name: 'Metro Cities', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'], deliveryDays: 3, isActive: true },
        { name: 'Tier 2 Cities', cities: ['Pune', 'Jaipur', 'Lucknow', 'Ahmedabad'], deliveryDays: 5, isActive: true },
      ],
    },
    tax: {
      isActive: true,
      defaultRate: 18,
      taxes: [
        { name: 'GST 5%', rate: 5, cgst: 2.5, sgst: 2.5, igst: 5, isActive: true },
        { name: 'GST 12%', rate: 12, cgst: 6, sgst: 6, igst: 12, isActive: true },
        { name: 'GST 18%', rate: 18, cgst: 9, sgst: 9, igst: 18, isActive: true },
        { name: 'GST 28%', rate: 28, cgst: 14, sgst: 14, igst: 28, isActive: true },
      ],
      hsnCode: '6204',
    },
    general: {
      storeName: 'ÉLÉVATION',
      storeEmail: 'support@elevation.com',
      storePhone: '+919999999999',
      gstin: '',
      currency: 'INR',
      currencySymbol: '₹',
    },
  });

  console.log('Settings seeded!');
  process.exit(0);
}

seedSettings().catch(console.error);