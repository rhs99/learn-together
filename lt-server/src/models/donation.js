const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
        default: 0,
        required: true,
    },
    dateOfDonation: {
        type: Date,
        default: Date.now,
        required: true,
    },
    method: {
        type: mongoose.Types.ObjectId,
        ref: 'PaymentMethod',
    },
    transactionID: {
        type: String,
        required: true,
    },
    accountNo: {
        type: Number,
        required: true,
    },
    contactNo: {
        type: Number,
    },
    furtherInfo: {
        type: String,
    },
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
