const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    dateOfDonation: {
        type: Date,
        required: true,
    },
    method: {
        type: mongoose.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true,
    },
    transactionID: {
        type: String,
        unique: true,
    },
    contactInfo: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
