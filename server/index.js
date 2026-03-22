require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Challan = require('./models/Challan');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// GET: Fetch all challans with Search & Filter
app.get('/api/challans', async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    if (search) {
      // Searching by plate number instead of owner
      query.plate_number = { $regex: search, $options: 'i' };
    }

    const challans = await Challan.find(query).sort({ timestamp: -1 });
    res.json(challans);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// POST: Seed initial data (Run this once to fill your DB)
app.post('/api/challans/seed', async (req, res) => {
  const sampleData = [
    { vehicle: "MH12AB1234", owner: "Rajesh Khanna", violation: "Red Light", fine: 2000, status: "Pending" },
    { vehicle: "KA05EF5678", owner: "Priya Sharma", violation: "Speeding", fine: 1500, status: "Paid" }
  ];
  await Challan.insertMany(sampleData);
  res.send("Database Seeded!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));