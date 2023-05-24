const express = require('express');
const router = express.Router();

const { extractAndVerifyToken } = require('../common/middlewares');

const QuestionController = require('../controllers/question');

router.get('/', QuestionController.getQuestion);
router.post('/list', QuestionController.getAllQuestions);
router.post('/create', extractAndVerifyToken, QuestionController.addNewQuestion);

module.exports = router;
