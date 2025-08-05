const AnswerService = require('../services/answer');
const logger = require('../config/logger');

const getAnswer = async (req, res) => {
    logger.debug('Fetching answer details', { answerId: req.params._id });
    const answer = await AnswerService.getAnswer(req.params._id);
    res.status(200).json(answer);
};

const getAllAnswers = async (req, res) => {
    logger.debug('Fetching all answers for question', { questionId: req.query.questionId });
    const answers = await AnswerService.getAllAnswers(req.query.questionId);
    logger.debug('Answers fetched successfully', { questionId: req.query.questionId, answerCount: answers.length });
    res.status(200).json(answers);
};

const addNewAnswer = async (req, res) => {
    req.body.user = req.user;
    logger.business('New answer creation', {
        questionId: req.body.questionId,
        userId: req.user,
        hasImages: req.body.imageLocations?.length > 0,
    });
    await AnswerService.addNewAnswer(req.body);
    res.status(201).json();
};

const deleteAnswer = async (req, res) => {
    logger.business('Answer deletion', { answerId: req.params._id, userId: req.user });
    await AnswerService.deleteAnswer(req.params._id, req.user);
    res.status(200).json();
};

module.exports = { getAllAnswers, addNewAnswer, getAnswer, deleteAnswer };
