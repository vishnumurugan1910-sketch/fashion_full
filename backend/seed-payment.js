require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/Settings');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Settings.findOneAndUpdate(
    { key: 'general' },
    { 
      key: 'general',
      payment: {
        razorpay: {
          keyId: 'rzp_test_SjGUYK65FeW42d',
          keySecret: '0e4q6SJYNQ8vy4bXCtOb74Tb',
          isActive: true
        },
        cod: {
          isActive: true,
          minimumOrder: 500,
          maximumOrder: 10000,
          charges: 50
        },
        upi: { isActive: false, upiId: '' }
      }
    },
    { upsert: true }
  );
  console.log('Updated!');
  process.exit(0);
}).catch(console.error);