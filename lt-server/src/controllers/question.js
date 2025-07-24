const QuestionService = require('../services/question');

const getAllQuestions = async (req, res) => {
    req.body.user = req.user || null;
    const questions = await QuestionService.getAllQuestions(req.body, req.query);
    res.status(200).json(questions);
};

const getQuestion = async (req, res) => {
    const question = await QuestionService.getQuestion(req.params._id);
    res.status(200).json(question);
};

const addNewQuestion = async (req, res) => {
    req.body.user = req.user;
    await QuestionService.addNewQuestion(req.body);
    res.status(201).json();
};

const deleteQuestion = async (req, res) => {
    await QuestionService.deleteQuestion(req.params._id, req.user);
    res.status(200).json();
};

const addToFavourite = async (req, res) => {
    req.body.user = req.user;
    const status = await QuestionService.addToFavourite(req.body);
    res.status(200).json(status);
};

module.exports = { getAllQuestions, addNewQuestion, getQuestion, deleteQuestion, addToFavourite };
