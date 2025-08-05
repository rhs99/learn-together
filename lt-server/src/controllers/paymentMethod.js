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
    logger.business('New payment method creation', {
        methodName: req.body.name,
        methodType: req.body.type,
    });
    await PaymentMethodService.addNewPaymentMethod(req.body);
    logger.info('Payment method created successfully', { methodName: req.body.name });
    res.status(201).json();
};

module.exports = { getPaymentMethods, addNewPaymentMethod, getPaymentMethod };
