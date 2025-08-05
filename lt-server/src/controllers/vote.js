const VoteService = require('../services/vote');
const logger = require('../config/logger');

const updateVote = async (req, res) => {
    req.body.user = req.user;
    logger.business('Vote update', {
        qaId: req.body.qaId,
        userId: req.user,
        isUpVote: req.body.up,
        isQuestion: req.body.q,
    });
    const updatedCount = await VoteService.updateVote(req.body);
    logger.debug('Vote updated successfully', {
        qaId: req.body.qaId,
        newCounts: updatedCount,
    });
    res.status(200).json(updatedCount);
};

module.exports = { updateVote };
