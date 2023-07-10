const express = require('express');
const { extractAndVerifyToken } = require('../common/middlewares');

const router = express.Router();

const QAVoteController = require('../controllers/qavote');

router.post('/update', extractAndVerifyToken, QAVoteController.updateVote);
router.get('/countUpvotes', QAVoteController.countUpvotesForUser);
router.get('/countDownvotes', QAVoteController.countDownvotesForUser);

module.exports = router;
