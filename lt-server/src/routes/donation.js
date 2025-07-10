const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const DonationController = require('../controllers/donatiton');

router.post('/', DonationController.addNewDonation);
router.get('/', extractAndVerifyToken, hasAdminPrivilege, DonationController.getAllDonations);
router.put('/:id/approve', extractAndVerifyToken, hasAdminPrivilege, DonationController.approveDonation);

module.exports = router;
