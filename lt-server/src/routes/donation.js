const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');
const { validate } = require('../common/validation');
const { patchDonationSchema } = require('../validations/donation');

const DonationController = require('../controllers/donatiton');

router.post('/', DonationController.addNewDonation);
router.get('/', extractAndVerifyToken, hasAdminPrivilege, DonationController.getAllDonations);
router.patch('/:id', extractAndVerifyToken, hasAdminPrivilege, validate(patchDonationSchema), DonationController.updateDonation);

module.exports = router;
