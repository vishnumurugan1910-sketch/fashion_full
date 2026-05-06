const mongoose = require('mongoose');

const shippingZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cities: [String],
  states: [String],
  pincodes: [String],
  deliveryDays: { type: Number, default: 5 },
  isActive: { type: Boolean, default: true },
});

const taxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rate: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  
  payment: {
    razorpay: {
      keyId: { type: String, default: '' },
      keySecret: { type: String, default: '' },
      isActive: { type: Boolean, default: true },
    },
    cod: {
      isActive: { type: Boolean, default: true },
      minimumOrder: { type: Number, default: 500 },
      maximumOrder: { type: Number, default: 10000 },
      charges: { type: Number, default: 0 },
    },
    upi: {
      isActive: { type: Boolean, default: false },
      upiId: { type: String, default: '' },
    },
  },
  
  shipping: {
    freeShippingAbove: { type: Number, default: 999 },
    defaultCharge: { type: Number, default: 99 },
    expressCharge: { type: Number, default: 199 },
    processingDays: { type: Number, default: 2 },
    zones: [shippingZoneSchema],
  },
  
  tax: {
    isActive: { type: Boolean, default: true },
    defaultRate: { type: Number, default: 18 },
    taxes: [taxSchema],
    hsnCode: { type: String, default: '6204' },
  },
  
  general: {
    storeName: { type: String, default: 'ÉLÉVATION' },
    storeEmail: { type: String, default: 'support@elevation.com' },
    storePhone: { type: String, default: '+919999999999' },
    storeAddress: { type: String, default: '' },
    gstin: { type: String, default: '' },
    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },
  },
}, { timestamps: true, minimize: false });

module.exports = mongoose.model('Settings', settingsSchema);