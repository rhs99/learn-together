const express = require('express');
const router = express.Router();
const { extractAndVerifyToken } = require('../common/middlewares');

const AnswerController = require('../controllers/answer');

router.get('/:_id', AnswerController.getAnswer);
router.get('/', AnswerController.getAllAnswers);
router.post('/', extractAndVerifyToken, AnswerController.addNewAnswer);
router.delete('/:_id', extractAndVerifyToken, AnswerController.deleteAnswer);

module.exports = router;
