const Donation = require('../models/donation');
const logger = require('../config/logger');

const addNewDonation = async (body) => {
    logger.database('Creating new donation', 'donations', {
        amount: body.amount,
        method: body.method,
        hasPersonalInfo: !!body.name,
    });
    const newDonation = new Donation(body);
    await newDonation.save();
    logger.database('Donation created successfully', 'donations', { donationId: newDonation._id });
};

const getAllDonations = async () => {
    logger.database('Querying pending donations', 'donations');
    const donations = await Donation.find({ status: 'pending' }).populate('method').sort({ dateOfDonation: -1 });
    logger.database('Donations retrieved', 'donations', { count: donations.length });
    return donations;
};

const approveDonation = async (id) => {
    try {
        if (!id) {
            logger.warn('Donation approval attempted without ID');
            throw new Error('Donation ID is required');
        }

        logger.database('Finding donation for approval', 'donations', { donationId: id });
        const donation = await Donation.findById(id);

        if (!donation) {
            logger.warn('Donation approval failed - donation not found', { donationId: id });
            throw new Error('Donation not found');
        }

        const oldStatus = donation.status;
        donation.status = 'completed';

        logger.database('Updating donation status', 'donations', {
            donationId: id,
            oldStatus,
            newStatus: 'completed',
        });

        await donation.save();

        logger.database('Donation approved successfully', 'donations', {
            donationId: id,
            amount: donation.amount,
        });

        return donation;
    } catch (error) {
        if (error.name === 'CastError') {
            logger.warn('Invalid donation ID format provided', { donationId: id });
            throw new Error('Invalid donation ID format');
        }
        logger.error('Error during donation approval', {
            error: error.message,
            donationId: id,
        });
        throw error;
    }
};

module.exports = { addNewDonation, getAllDonations, approveDonation };
