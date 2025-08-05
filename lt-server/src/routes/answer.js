const express = require('express');
const router = express.Router();
const { extractAndVerifyToken } = require('../common/middlewares');
const { validate } = require('../common/validation');
const {
    getAnswerSchema,
    getAllAnswersSchema,
    addNewAnswerSchema,
    deleteAnswerSchema,
} = require('../validations/answer');

const AnswerController = require('../controllers/answer');

router.get('/:_id', validate(getAnswerSchema), AnswerController.getAnswer);
router.get('/', validate(getAllAnswersSchema), AnswerController.getAllAnswers);
router.post('/', extractAndVerifyToken, validate(addNewAnswerSchema), AnswerController.addNewAnswer);
router.delete('/:_id', extractAndVerifyToken, validate(deleteAnswerSchema), AnswerController.deleteAnswer);

module.exports = router;
