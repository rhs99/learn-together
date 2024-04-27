const Donation = require('../models/donation');

const addNewDonation = async (body) => {
    const newDonation = new Donation(body);
    return await newDonation.save();
};

module.exports = { addNewDonation };
