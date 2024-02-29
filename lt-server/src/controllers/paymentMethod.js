const PaymentMethodService = require('../services/paymentMethod');

const getPaymentMethod = async (req, res) => {
    try {
        const paymentMethod = await PaymentMethodService.getPaymentMethod(req.params._id);
        res.status(200).json(paymentMethod);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethodService.getPaymentMethods();
        res.status(200).json(paymentMethods);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addNewPaymentMethod = async (req, res) => {
    try {
        await PaymentMethodService.addNewPaymentMethod(req.body);
        res.status(201).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { getPaymentMethods, addNewPaymentMethod, getPaymentMethod };
