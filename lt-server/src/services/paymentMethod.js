const PaymentMethod = require('../models/paymentMetod');
const logger = require('../config/logger');

const getPaymentMethods = async () => {
    logger.debug('Querying all payment methods', 'paymentMethods');
    const paymentMethods = await PaymentMethod.find({}).lean();
    logger.debug('Payment methods retrieved', 'paymentMethods', { count: paymentMethods.length });
    return paymentMethods;
};

const getPaymentMethod = async (id) => {
    logger.debug('Querying payment method by ID', 'paymentMethods', { paymentMethodId: id });
    const paymentMethod = await PaymentMethod.findById(id);
    if (!paymentMethod) {
        logger.warn('Payment method not found', { paymentMethodId: id });
    }
    return paymentMethod;
};

const addNewPaymentMethod = async (body) => {
    logger.debug('Creating new payment method', 'paymentMethods', {
        methodName: body.name,
        methodType: body.type,
    });
    const newPaymentMethod = new PaymentMethod(body);
    await newPaymentMethod.save();
    logger.debug('Payment method created successfully', 'paymentMethods', {
        paymentMethodId: newPaymentMethod._id,
        methodName: newPaymentMethod.name,
    });
};

module.exports = { getPaymentMethods, addNewPaymentMethod, getPaymentMethod };
