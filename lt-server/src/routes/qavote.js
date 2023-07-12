const express = require('express');
const { extractAndVerifyToken } = require('../common/middlewares');

const router = express.Router();

const QAVoteController = require('../controllers/qavote');

router.post('/update', extractAndVerifyToken, QAVoteController.updateVote);

module.exports = router;
