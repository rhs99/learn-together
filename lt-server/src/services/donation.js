const Donation = require('../models/donation');

const addNewDonation = async (body) => {
    const newDonation = new Donation(body);
    await newDonation.save();
};

const getAllDonations = async () => {
    return await Donation.find({ status: 'pending' }).populate('method').sort({ dateOfDonation: -1 });
};

const approveDonation = async (id) => {
    try {
        if (!id) {
            throw new Error('Donation ID is required');
        }

        const donation = await Donation.findById(id);

        if (!donation) {
            throw new Error('Donation not found');
        }

        donation.status = 'completed';
        await donation.save();
        return donation;
    } catch (error) {
        if (error.name === 'CastError') {
            throw new Error('Invalid donation ID format');
        }
        throw error;
    }
};

module.exports = { addNewDonation, getAllDonations, approveDonation };
