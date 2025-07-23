const express = require('express');
const { extractAndVerifyToken } = require('../common/middlewares');

const router = express.Router();

const VoteController = require('../controllers/vote');

router.post('/update', extractAndVerifyToken, VoteController.updateVote);

module.exports = router;
