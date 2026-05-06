const express = require('express');
const router = express.Router();
const SeoSettings = require('../models/SeoSettings');

router.get('/', async (req, res) => {
  try {
    const seo = await SeoSettings.find().sort({ page: 1 });
    res.json(seo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:page', async (req, res) => {
  try {
    const seo = await SeoSettings.findOne({ page: req.params.page });
    res.json(seo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const seo = new SeoSettings(req.body);
    await seo.save();
    res.status(201).json(seo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:page', async (req, res) => {
  try {
    const seo = await SeoSettings.findOneAndUpdate(
      { page: req.params.page },
      req.body,
      { new: true, upsert: true }
    );
    res.json(seo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await SeoSettings.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;