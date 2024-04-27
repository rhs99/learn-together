const DonationService = require('../services/donation');

const addNewDonation = async (req, res) => {
    try {
        const donation = await DonationService.addNewDonation(req.body);
        res.status(201).json(donation);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { addNewDonation };
