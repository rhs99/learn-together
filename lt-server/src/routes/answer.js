const express = require('express');
const router = express.Router();
const { extractAndVerifyToken } = require('../common/middlewares');

const AnswerController = require('../controllers/answer');

router.get('/', AnswerController.getAnswer);
router.get('/list', AnswerController.getAllAnswers);
router.post('/create', extractAndVerifyToken, AnswerController.addNewAnswer);
router.delete('/:_id', AnswerController.softDeleteAnswer);

module.exports = router;
