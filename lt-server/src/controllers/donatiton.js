const DonationService = require('../services/donation');
const logger = require('../config/logger');

const addNewDonation = async (req, res) => {
    logger.info('New donation submission', {
        amount: req.body.amount,
        method: req.body.method,
        donorInfo: req.body.name ? 'named' : 'anonymous',
        timestamp: new Date().toISOString(),
    });
    await DonationService.addNewDonation(req.body);
    logger.info('Donation created successfully', { amount: req.body.amount });
    res.status(201).json({
        message: 'Donation added successfully',
    });
};

const getAllDonations = async (req, res) => {
    logger.debug('Fetching all pending donations');
    const donations = await DonationService.getAllDonations();
    logger.debug('Donations fetched successfully', { donationCount: donations.length });
    res.status(200).json(donations);
};

const updateDonation = async (req, res) => {
    if (!req.params.id) {
        logger.warn('Donation update attempted without ID');
        return res.status(400).json({ message: 'Donation ID is required' });
    }

    logger.info('Donation update', {
        donationId: req.params.id,
        status: req.body.status,
        timestamp: new Date().toISOString(),
    });
    const donation = await DonationService.approveDonation(req.params.id);
    logger.info('Donation updated successfully', {
        donationId: donation._id,
        amount: donation.amount,
        status: donation.status,
    });

    res.status(200).json({
        message: 'Donation updated successfully',
        donation: {
            id: donation._id,
            status: donation.status,
        },
    });
};

const approveDonation = updateDonation;

module.exports = { addNewDonation, getAllDonations, approveDonation, updateDonation };
