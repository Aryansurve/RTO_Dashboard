// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const Challan = require('./models/Challan');

// const app = express();

// // Connect to Database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // GET: Fetch all challans with Search & Filter
// app.get('/api/challans', async (req, res) => {
//   try {
//     const { search, status } = req.query;
//     let query = {};

//     if (status && status !== 'all') {
//       query.status = status.charAt(0).toUpperCase() + status.slice(1);
//     }

//     if (search) {
//       // Searching by plate number instead of owner
//       query.plate_number = { $regex: search, $options: 'i' };
//     }

//     const challans = await Challan.find(query).sort({ timestamp: -1 });
//     res.json(challans);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// });

// // POST: Seed initial data (Run this once to fill your DB)
// app.post('/api/challans/seed', async (req, res) => {
//   const sampleData = [
//     { vehicle: "MH12AB1234", owner: "Rajesh Khanna", violation: "Red Light", fine: 2000, status: "Pending" },
//     { vehicle: "KA05EF5678", owner: "Priya Sharma", violation: "Speeding", fine: 1500, status: "Paid" }
//   ];
//   await Challan.insertMany(sampleData);
//   res.send("Database Seeded!");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// new one working with verifiication : 

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const connectDB = require('./config/db');

// // Import Models
// const Challan = require('./models/Challan');
// const User = require('./models/User');
// const Hospital = require('./models/Hospital');

// const app = express();

// // Connect to Database
// // Note: This connects to your primary MONGO_URI (rto_database)
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // ==========================================
// // 1. EXISTING CHALLAN FUNCTIONALITY
// // ==========================================

// // GET: Fetch all challans with Search & Filter
// app.get('/api/challans', async (req, res) => {
//   try {
//     const { search, status } = req.query;
//     let query = {};

//     if (status && status !== 'all') {
//       query.status = status.charAt(0).toUpperCase() + status.slice(1);
//     }

//     if (search) {
//       query.plate_number = { $regex: search, $options: 'i' };
//     }

//     const challans = await Challan.find(query).sort({ timestamp: -1 });
//     res.json(challans);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// });

// // POST: Seed initial challan data
// app.post('/api/challans/seed', async (req, res) => {
//   const sampleData = [
//     { vehicle: "MH12AB1234", owner: "Rajesh Khanna", violation: "Red Light", fine: 2000, status: "Pending" },
//     { vehicle: "KA05EF5678", owner: "Priya Sharma", violation: "Speeding", fine: 1500, status: "Paid" }
//   ];
//   await Challan.insertMany(sampleData);
//   res.send("Database Seeded!");
// });


// // ==========================================
// // 2. NEW EMERGENCY DRIVER FUNCTIONALITY
// // ==========================================

// // GET: Fetch Drivers and Map their Hospital data
// // .populate('hospitalId') links the driver to their respective hospital
// app.get('/api/drivers', async (req, res) => {
//   try {
//     const drivers = await User.find({ role: 'Driver' })
//       .populate('hospitalId')
//       .sort({ createdAt: -1 });

//     res.json(drivers);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching drivers", error: err.message });
//   }
// });

// // PATCH: Approve or Reject a driver
// app.patch('/api/drivers/:id/status', async (req, res) => {
//   try {
//     const { status } = req.body; // Expecting 'Verified' or 'Rejected'
    
//     // Validate status
//     if (!['Verified', 'Rejected', 'Pending'].includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id, 
//       { verificationStatus: status }, 
//       { new: true }
//     ).populate('hospitalId');

//     if (!updatedUser) {
//       return res.status(404).json({ message: "Driver not found" });
//     }

//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating status", error: err.message });
//   }
// });

// // ==========================================
// // SERVER START
// // ==========================================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// -----------------------------------------------------------------------------------
//new updated with merged link : 

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Create two bridge connections using your .env links
const rtoDB = mongoose.createConnection(process.env.MONGO_URI);
const emergencyDB = mongoose.createConnection(process.env.MONGO_URI1);

// 2. Link your models specifically to the correct database connection
// This ensures Challans look in rto_database and Users look in emergency_app
const Challan = rtoDB.model('Challan', require('./models/Challan').schema);
const User = emergencyDB.model('User', require('./models/User').schema);
const Hospital = emergencyDB.model('Hospital', require('./models/Hospital').schema);

// Log successful connections
rtoDB.on('connected', () => console.log('✅ Connected to RTO Database (Challans)'));
emergencyDB.on('connected', () => console.log('✅ Connected to Emergency Database (Drivers/Hospitals)'));

// ==========================================
// ROUTES
// ==========================================

// GET: Fetch Drivers (from Emergency DB) + Populate Hospital
app.get('/api/drivers', async (req, res) => {
  try {
    // Note: Population works perfectly here because both are on 'emergencyDB'
    const drivers = await User.find({ role: 'Driver' })
      .populate('hospitalId') 
      .sort({ createdAt: -1 });

    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching drivers", error: err.message });
  }
});

// GET: Fetch Challans (from RTO DB)
app.get('/api/challans', async (req, res) => {
  try {
    const challans = await Challan.find().sort({ timestamp: -1 });
    res.json(challans);
  } catch (err) {
    res.status(500).json({ message: "Error fetching challans", error: err.message });
  }
});

// PATCH: Approve/Reject Driver
app.patch('/api/drivers/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await User.findByIdAndUpdate(req.params.id, { verificationStatus: status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

