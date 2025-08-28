const PaymentMethodService = require('../services/paymentMethod');
const logger = require('../config/logger');

const getPaymentMethod = async (req, res) => {
    logger.debug('Fetching payment method details', { paymentMethodId: req.params._id });
    const paymentMethod = await PaymentMethodService.getPaymentMethod(req.params._id);
    res.status(200).json(paymentMethod);
};

const getPaymentMethods = async (req, res) => {
    logger.debug('Fetching all payment methods');
    const paymentMethods = await PaymentMethodService.getPaymentMethods();
    logger.debug('Payment methods fetched successfully', {
        paymentMethodCount: paymentMethods.length,
    });
    res.status(200).json(paymentMethods);
};

const addNewPaymentMethod = async (req, res) => {
    logger.info('New payment method creation', {
        methodName: req.body.method,
        phoneNumber: req.body.phoneNumber,
        timestamp: new Date().toISOString(),
    });
    await PaymentMethodService.addNewPaymentMethod(req.body);
    res.status(201).json();
};

module.exports = { getPaymentMethods, addNewPaymentMethod, getPaymentMethod };
