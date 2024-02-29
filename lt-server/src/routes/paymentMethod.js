const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const PaymentMethodController = require('../controllers/paymentMethod');

router.get('/', PaymentMethodController.getPaymentMethods);
router.get('/:_id', PaymentMethodController.getPaymentMethod);
router.post('/', extractAndVerifyToken, hasAdminPrivilege, PaymentMethodController.addNewPaymentMethod);

module.exports = router;
