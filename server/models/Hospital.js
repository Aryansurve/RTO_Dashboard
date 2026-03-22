const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    contactNumber: { type: String, required: true }
}, { timestamps: true, collection: 'hospitals' });

module.exports = mongoose.model('Hospital', hospitalSchema);
