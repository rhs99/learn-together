const DonationService = require('../services/donation');

const addNewDonation = async (req, res) => {
    await DonationService.addNewDonation(req.body);
    res.status(201).json({
        message: 'Donation added successfully',
    });
};

const getAllDonations = async (req, res) => {
    const donations = await DonationService.getAllDonations();
    res.status(200).json(donations);
};

const approveDonation = async (req, res) => {
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
};

module.exports = { addNewDonation, getAllDonations, approveDonation };
