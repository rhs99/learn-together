const QAVoteService = require('../services/qavote');

const updateVote = async (req, res) => {
    try {
        req.body.uId = req.user;
        const newCnt = await QAVoteService.updateVote(req.body);
        res.status(200).json(newCnt);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const countUpvotesForUser = async (req, res) => {
    try {
        //req.body.uId = req.query.userId;
        const newCnt = await QAVoteService.countUpvotesForUser(req.query.userId);
        res.status(200).json(newCnt);
    } catch (e) {
        console.log(e.message);
    }
};

const countDownvotesForUser = async (req, res) => {
    try {
        //req.body.uId = req.query.userId;
        const newCnt = await QAVoteService.countDownvotesForUser(req.query.userId);
        res.status(200).json(newCnt);
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = { updateVote, countUpvotesForUser, countDownvotesForUser };
