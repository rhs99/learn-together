const express = require('express');
const router = express.Router();

const QuestionController = require('../controllers/question');

router.get('/list', QuestionController.getAllQuestions);
router.post('/create', QuestionController.addNewQuestion);
router.post('/softDelete', QuestionController.softDeleteQuestion);

module.exports = router;
