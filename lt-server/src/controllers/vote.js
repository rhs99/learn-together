const VoteService = require('../services/vote');
const handleError = require('../common/handleError');

const updateVote = async (req, res) => {
    try {
        req.body.user = req.user;
        const updatedCount = await VoteService.updateVote(req.body);
        res.status(200).json(updatedCount);
    } catch (error) {
        handleError(res, error, 'An error occurred while updating the vote');
    }
};

module.exports = { updateVote };
