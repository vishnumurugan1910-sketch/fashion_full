const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

router.get('/', async (req, res) => {
  try {
    const { status, product, page = 1, limit = 20, isSpam, isFeatured } = req.query;
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (product) query.product = product;
    if (isSpam !== undefined) query.isSpam = isSpam === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    
    const reviews = await Review.find(query).sort({ createdAt: -1 })
      .populate('product', 'name image')
      .skip((page - 1) * limit).limit(parseInt(limit));
    
    const total = await Review.countDocuments(query);
    res.json({ reviews, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;