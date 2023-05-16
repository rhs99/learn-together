const express = require('express');
const router = express.Router();

const QuestionController = require('../controllers/question');

router.get('/', QuestionController.getQuestion);
router.get('/list', QuestionController.getAllQuestions);
router.post('/create', QuestionController.addNewQuestion);
router.delete('/_id', QuestionController.softDeleteQuestion);

module.exports = router;
