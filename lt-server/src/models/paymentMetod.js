const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;
