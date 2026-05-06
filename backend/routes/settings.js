const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: 'general' });
    if (!settings) {
      return res.json({
        key: 'general',
        payment: { razorpay: {}, cod: {}, upi: {} },
        shipping: { zones: [] },
        tax: { taxes: [] },
        general: {},
      });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { key: 'general' },
      req.body,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/shipping/zones', async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: 'general' });
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    settings.shipping.zones.push(req.body);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/shipping/zones/:id', async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: 'general' });
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    const zone = settings.shipping.zones.id(req.params.id);
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    Object.assign(zone, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/shipping/zones/:id', async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: 'general' });
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    settings.shipping.zones.pull({ _id: req.params.id });
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/tax', async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: 'general' });
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    settings.tax.taxes.push(req.body);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/tax/:id', async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: 'general' });
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    settings.tax.taxes.pull({ _id: req.params.id });
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;