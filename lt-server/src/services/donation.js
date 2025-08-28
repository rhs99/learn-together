const Donation = require('../models/donation');
const logger = require('../config/logger');

const addNewDonation = async (body) => {
    try {
        logger.debug('Creating new donation', {
            operation: 'Database Operation',
            collection: 'donations',
            data: typeof body === 'object' ? JSON.stringify(body) : body,
            timestamp: new Date().toISOString(),
        });
        const newDonation = await Donation(body).save();
        logger.debug('Donation created successfully', {
            operation: 'Database Operation',
            collection: 'donations',
            data: { donationId: newDonation._id },
            timestamp: new Date().toISOString(),
        });
        return newDonation;
    } catch (error) {
        throw error;
    }
};

const getAllDonations = async () => {
    logger.debug('Querying pending donations', {
        operation: 'Database Operation',
        collection: 'donations',
        timestamp: new Date().toISOString(),
    });
    const donations = await Donation.find({ status: 'pending' }).populate('method').sort({ dateOfDonation: -1 });
    logger.debug('Donations retrieved', {
        operation: 'Database Operation',
        collection: 'donations',
        data: { count: donations.length },
        timestamp: new Date().toISOString(),
    });
    return donations;
};

const approveDonation = async (id) => {
    try {
        if (!id) {
            logger.warn('Donation approval attempted without ID');
            throw new Error('Donation ID is required');
        }

        logger.debug('Finding donation for approval', {
            operation: 'Database Operation',
            collection: 'donations',
            data: { donationId: id },
            timestamp: new Date().toISOString(),
        });
        const donation = await Donation.findById(id);

        if (!donation) {
            logger.warn('Donation approval failed - donation not found', { donationId: id });
            throw new Error('Donation not found');
        }

        const oldStatus = donation.status;
        donation.status = 'completed';

        logger.debug('Updating donation status', {
            operation: 'Database Operation',
            collection: 'donations',
            data: {
                donationId: id,
                oldStatus,
                newStatus: 'completed',
            },
            timestamp: new Date().toISOString(),
        });

        await donation.save();

        logger.debug('Donation approved successfully', {
            operation: 'Database Operation',
            collection: 'donations',
            data: {
                donationId: id,
                amount: donation.amount,
            },
            timestamp: new Date().toISOString(),
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
