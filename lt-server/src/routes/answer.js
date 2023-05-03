const express = require('express');
const router = express.Router();

const AnswerController = require('../controllers/answer');

router.get('/list', AnswerController.getAllAnswers);
router.post('/create', AnswerController.addNewAnswer);

module.exports = router;
