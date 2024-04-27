const express = require('express');
const router = express.Router();

const DonationController = require('../controllers/donatiton');

router.post('/', DonationController.addNewDonation);

module.exports = router;
