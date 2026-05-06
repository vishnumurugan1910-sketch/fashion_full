const express = require('express');
const router = express.Router();
const Return = require('../models/Return');

router.get('/', async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (type) query.type = type;
    
    const returns = await Return.find(query).sort({ createdAt: -1 });
    res.json({ returns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const returnRequest = new Return(req.body);
    await returnRequest.save();
    res.status(201).json(returnRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const returnRequest = await Return.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!returnRequest) return res.status(404).json({ error: 'Return request not found' });
    res.json(returnRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const returnRequest = await Return.findByIdAndDelete(req.params.id);
    if (!returnRequest) return res.status(404).json({ error: 'Return request not found' });
    res.json({ message: 'Return request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;