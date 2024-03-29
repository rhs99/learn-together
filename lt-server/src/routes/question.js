const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, extractAndVerifyTokenIfPresent } = require('../common/middlewares');

const QuestionController = require('../controllers/question');

router.get('/:_id', QuestionController.getQuestion);
router.post('/', extractAndVerifyToken, QuestionController.addNewQuestion);
router.delete('/:_id', extractAndVerifyToken, QuestionController.deleteQuestion);
router.post('/search', extractAndVerifyTokenIfPresent, QuestionController.getAllQuestions);
router.post('/favourite', extractAndVerifyToken, QuestionController.addToFavourite);

module.exports = router;
