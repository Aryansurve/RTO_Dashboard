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

// 1. Setup Multi-Database Connections (Dual Bridge)
// rtoDB handles Challans & Analytics
// emergencyDB handles Drivers & Hospitals
const rtoDB = mongoose.createConnection(process.env.MONGO_URI);
const emergencyDB = mongoose.createConnection(process.env.MONGO_URI1);

// 2. Register Models to the Correct Databases
const Challan = rtoDB.model('Challan', require('./models/Challan').schema);
const User = emergencyDB.model('User', require('./models/User').schema);
const Hospital = emergencyDB.model('Hospital', require('./models/Hospital').schema);

// Log connections
rtoDB.on('connected', () => console.log('✅ Connected to RTO Database (Challans)'));
emergencyDB.on('connected', () => console.log('✅ Connected to Emergency Database (Drivers/Hospitals)'));

// ==========================================
// 🚨 EMERGENCY DRIVER ROUTES (Central Admin)
// ==========================================

// GET: Fetch all Drivers and Map their Hospital data
app.get('/api/drivers', async (req, res) => {
  try {
    const drivers = await User.find({ role: 'Driver' })
      .populate('hospitalId') 
      .sort({ createdAt: -1 });

    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching drivers", error: err.message });
  }
});

// PATCH: Approve or Reject Driver Action (Central Admin)
app.patch('/api/drivers/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // Expecting 'Verified' or 'Rejected'
    
    const updated = await User.findByIdAndUpdate(
        req.params.id, 
        { verificationStatus: status }, 
        { new: true }
    ).populate('hospitalId'); // Populate so the frontend gets the latest hospital info back

    if (!updated) {
        return res.status(404).json({ message: "Driver not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
});

// ==========================================
// 🛡️ CHALLAN ROUTES (RTO DB)
// ==========================================

// GET: Fetch all challans
app.get('/api/challans', async (req, res) => {
  try {
    const challans = await Challan.find().sort({ timestamp: -1 });
    res.json(challans);
  } catch (err) {
    res.status(500).json({ message: "Error fetching challans", error: err.message });
  }
});

// ==========================================
// 🤖 AI PROCESSING & ANALYTICS (Adv. Features)
// ==========================================

// GET: Fetch the latest AI Processing session data
app.get('/api/ai-processing', async (req, res) => {
  try {
    // Find the very last record inserted to get the most recent video URL
    const latestRecord = await Challan.findOne().sort({ timestamp: -1 });

    if (!latestRecord) {
      return res.status(404).json({ message: "No processing data found" });
    }

    res.json({
      video_url: latestRecord.video_url,
      plates: latestRecord.plate_number,
      location: latestRecord.location,
      timestamp: latestRecord.timestamp
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching AI data", error: err.message });
  }
});

// GET: Fetch Aggregated Analytics Data for Charts
app.get('/api/analytics', async (req, res) => {
  try {
    // 1. Get Total Violations Count & Total Revenue
    const stats = await Challan.aggregate([
      {
        $group: {
          _id: null,
          totalViolations: { $sum: 1 },
          totalRevenue: { $sum: "$fine_amount" }
        }
      }
    ]);

    const totalViolations = stats.length > 0 ? stats[0].totalViolations : 0;
    const totalRevenue = stats.length > 0 ? stats[0].totalRevenue : 0;

    // 2. Aggregate violations by date for the Recharts frontend
    const chartData = await Challan.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%b %d", date: "$timestamp" } },
          violations: { $sum: 1 },
          rawDate: { $first: "$timestamp" }
        }
      },
      { $sort: { rawDate: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          violations: 1
        }
      }
    ]);

    res.json({
      totalViolations,
      totalRevenue,
      chartData
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics", error: err.message });
  }
});

// ==========================================
// 🏁 SERVER START
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
