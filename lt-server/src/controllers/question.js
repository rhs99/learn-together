const QuestionService = require('../services/question');
const logger = require('../config/logger');

const getAllQuestions = async (req, res) => {
    const filters = {
        chapterId: req.query.chapterId,
        tagIds: req.query.tagIds ? req.query.tagIds.split(',') : undefined,
        user: req.user || null,
    };
    const queryParams = {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        filterBy: req.query.filterBy,
    };
    logger.debug('Fetching all questions', {
        userId: req.user,
        filters,
        queryParams,
    });
    const questions = await QuestionService.getAllQuestions(filters, queryParams);
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
    logger.info('New question creation', {
        userId: req.user,
        title: req.body.title?.substring(0, 50) + '...',
        hasImages: req.body.imageLocations?.length > 0,
        timestamp: new Date().toISOString(),
    });
    await QuestionService.addNewQuestion(req.body);
    res.status(201).json();
};

const deleteQuestion = async (req, res) => {
    logger.info('Question deletion', {
        questionId: req.params._id,
        userId: req.user,
        timestamp: new Date().toISOString(),
    });
    await QuestionService.deleteQuestion(req.params._id, req.user);
    res.status(200).json();
};

const addToFavourite = async (req, res) => {
    const data = {
        questionId: req.params._id,
        user: req.user,
    };
    logger.info('Question favorite toggle', {
        questionId: data.questionId,
        userId: req.user,
        timestamp: new Date().toISOString(),
    });
    const status = await QuestionService.addToFavourite(data);
    res.status(200).json(status);
};

module.exports = { getAllQuestions, addNewQuestion, getQuestion, deleteQuestion, addToFavourite };
