const PaymentMethodService = require('../services/paymentMethod');

const getPaymentMethod = async (req, res) => {
    const paymentMethod = await PaymentMethodService.getPaymentMethod(req.params._id);
    res.status(200).json(paymentMethod);
};

const getPaymentMethods = async (req, res) => {
    const paymentMethods = await PaymentMethodService.getPaymentMethods();
    res.status(200).json(paymentMethods);
};

const addNewPaymentMethod = async (req, res) => {
    await PaymentMethodService.addNewPaymentMethod(req.body);
    res.status(201).json();
};

module.exports = { getPaymentMethods, addNewPaymentMethod, getPaymentMethod };
