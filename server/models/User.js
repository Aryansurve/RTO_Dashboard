const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Driver', 'User', 'Admin'], default: 'Driver' },
    vehicleId: { type: String },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital' // This links the user to a Hospital document
    },
    verificationStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true, collection: 'users' });

module.exports = mongoose.model('User', userSchema);
