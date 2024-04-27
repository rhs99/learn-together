const PaymentMethod = require('../models/paymentMetod');

const getPaymentMethods = async () => {
    const paymentMethods = await PaymentMethod.find({}).lean();
    return paymentMethods;
};

const getPaymentMethod = async (id) => {
    const paymentMethod = await PaymentMethod.findById(id);
    return paymentMethod;
};

const addNewPaymentMethod = async (body) => {
    const newPaymentMethod = new PaymentMethod(body);
    await newPaymentMethod.save();
};

module.exports = { getPaymentMethods, addNewPaymentMethod, getPaymentMethod };
