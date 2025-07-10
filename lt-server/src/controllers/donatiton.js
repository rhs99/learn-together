const DonationService = require('../services/donation');

const addNewDonation = async (req, res) => {
    try {
        await DonationService.addNewDonation(req.body);
        res.status(201).json({
            message: 'Donation added successfully',
        });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getAllDonations = async (req, res) => {
    try {
        const donations = await DonationService.getAllDonations();
        res.status(200).json(donations);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const approveDonation = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Donation ID is required' });
        }

        const donation = await DonationService.approveDonation(req.params.id);

        res.status(200).json({
            message: 'Donation approved successfully',
            donation: {
                id: donation._id,
                status: donation.status,
            },
        });
    } catch (e) {
        if (e.message === 'Donation not found') {
            return res.status(404).json({ message: e.message });
        } else if (e.message === 'Invalid donation ID format') {
            return res.status(400).json({ message: e.message });
        }

        res.status(500).json({ message: 'An error occurred while approving the donation' });
    }
};

module.exports = { addNewDonation, getAllDonations, approveDonation };
