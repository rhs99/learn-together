const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, extractAndVerifyTokenIfPresent } = require('../common/middlewares');
const { validate } = require('../common/validation');
const {
    getQuestionSchema,
    getAllQuestionsSchema,
    addNewQuestionSchema,
    deleteQuestionSchema,
    addToFavouriteSchema,
} = require('../validations/question');

const QuestionController = require('../controllers/question');

router.get('/', extractAndVerifyTokenIfPresent, validate(getAllQuestionsSchema), QuestionController.getAllQuestions);
router.get('/:_id', validate(getQuestionSchema), QuestionController.getQuestion);
router.post('/', extractAndVerifyToken, validate(addNewQuestionSchema), QuestionController.addNewQuestion);
router.put('/:_id/favourite', extractAndVerifyToken, validate(addToFavouriteSchema), QuestionController.addToFavourite);
router.delete('/:_id', extractAndVerifyToken, validate(deleteQuestionSchema), QuestionController.deleteQuestion);

module.exports = router;
