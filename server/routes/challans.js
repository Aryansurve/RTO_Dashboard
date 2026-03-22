const express = require('express');
const router = express.Router();
const Challan = require('../models/Challan');

// GET all challans with optional search and status filter
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    if (search) {
      query.$or = [
        { vehicle: { $regex: search, $options: 'i' } },
        { owner: { $regex: search, $options: 'i' } }
      ];
    }

    const challans = await Challan.find(query).sort({ date: -1 });
    res.json(challans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;