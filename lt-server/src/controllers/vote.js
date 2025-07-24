const VoteService = require('../services/vote');

const updateVote = async (req, res) => {
    req.body.user = req.user;
    const updatedCount = await VoteService.updateVote(req.body);
    res.status(200).json(updatedCount);
};

module.exports = { updateVote };
