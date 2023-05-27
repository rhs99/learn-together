const QuestionService = require('../services/question');

const getAllQuestions = async (req, res) => {
    try {
        const questions = await QuestionService.getAllQuestions(req.body, req.query);
        res.status(200).json(questions);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getQuestion = async (req, res) => {
    try {
        const question = await QuestionService.getQuestion(req.query.questionId);
        res.status(200).json(question);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addNewQuestion = async (req, res) => {
    try {
        req.body.user = req.user;
        await QuestionService.addNewQuestion(req.body);
        res.status(201).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        await QuestionService.deleteQuestion(req.params._id, req.user);
        res.status(200).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { getAllQuestions, addNewQuestion, getQuestion, deleteQuestion };
