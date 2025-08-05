const QuestionService = require('../services/question');
const logger = require('../config/logger');

const getAllQuestions = async (req, res) => {
    req.body.user = req.user || null;
    logger.debug('Fetching all questions', {
        userId: req.user,
        filters: req.body,
        queryParams: req.query,
    });
    const questions = await QuestionService.getAllQuestions(req.body, req.query);
    logger.debug('Questions fetched successfully', { questionCount: questions.length });
    res.status(200).json(questions);
};

const getQuestion = async (req, res) => {
    logger.debug('Fetching question details', { questionId: req.params._id });
    const question = await QuestionService.getQuestion(req.params._id);
    res.status(200).json(question);
};

const addNewQuestion = async (req, res) => {
    req.body.user = req.user;
    logger.business('New question creation', {
        userId: req.user,
        title: req.body.title?.substring(0, 50) + '...',
        hasImages: req.body.imageLocations?.length > 0,
    });
    await QuestionService.addNewQuestion(req.body);
    res.status(201).json();
};

const deleteQuestion = async (req, res) => {
    logger.business('Question deletion', { questionId: req.params._id, userId: req.user });
    await QuestionService.deleteQuestion(req.params._id, req.user);
    res.status(200).json();
};

const addToFavourite = async (req, res) => {
    req.body.user = req.user;
    logger.business('Question favorite toggle', { questionId: req.body.questionId, userId: req.user });
    const status = await QuestionService.addToFavourite(req.body);
    res.status(200).json(status);
};

module.exports = { getAllQuestions, addNewQuestion, getQuestion, deleteQuestion, addToFavourite };
