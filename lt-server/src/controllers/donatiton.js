const DonationService = require('../services/donation');
const logger = require('../config/logger');

const addNewDonation = async (req, res) => {
    logger.business('New donation submission', {
        amount: req.body.amount,
        method: req.body.method,
        donorInfo: req.body.name ? 'named' : 'anonymous',
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

const approveDonation = async (req, res) => {
    if (!req.params.id) {
        logger.warn('Donation approval attempted without ID');
        return res.status(400).json({ message: 'Donation ID is required' });
    }

    logger.business('Donation approval', { donationId: req.params.id });
    const donation = await DonationService.approveDonation(req.params.id);
    logger.info('Donation approved successfully', {
        donationId: donation._id,
        amount: donation.amount,
    });

    res.status(200).json({
        message: 'Donation approved successfully',
        donation: {
            id: donation._id,
            status: donation.status,
        },
    });
};

module.exports = { addNewDonation, getAllDonations, approveDonation };
