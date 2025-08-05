const express = require('express');
const { extractAndVerifyToken } = require('../common/middlewares');
const { validate } = require('../common/validation');
const { updateVoteSchema } = require('../validations/vote');

const router = express.Router();

const VoteController = require('../controllers/vote');

router.post('/update', extractAndVerifyToken, validate(updateVoteSchema), VoteController.updateVote);

module.exports = router;
