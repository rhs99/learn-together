const QAVoteService = require('../services/qavote');

const updateVote = async (req, res) => {
    try {
        req.body.uId = req.user;
        const newCnt = await QAVoteService.updateVote(req.body);
        res.status(200).json({ newCnt });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { updateVote };
