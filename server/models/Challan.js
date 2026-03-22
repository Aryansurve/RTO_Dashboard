const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  type: String, // "vehicle" or "plate"
  image_data: String // Base64 string
});

const ChallanSchema = new mongoose.Schema({
  plate_number: { type: String, required: true },
  images: [ImageSchema],
  timestamp: { type: Date, default: Date.now },
  location: { type: String, required: true },
  fine_amount: { type: Number, required: true },
  video_url: String,
  status: { type: String, default: 'Pending' } // Added to support your dashboard filters
});

module.exports = mongoose.model('Challan', ChallanSchema);