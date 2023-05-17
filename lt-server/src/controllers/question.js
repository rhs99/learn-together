const QuestionService = require('../services/question');

const getAllQuestions = async (req, res) => {
    try {
        const questions = await QuestionService.getAllQuestions(req.query.chapterId);
        res.status(200).json(questions);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getQuestion = async (req, res) => {
    try {
        const questions = await QuestionService.getQuestion(req.query.questionId);
        res.status(200).json(questions);
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

const softDeleteQuestion = async (req, res) => {
    try {
        const question = await QuestionService.softDeleteQuestion(req.params._id);
        res.status(200).json(question);
    } catch (e) {
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

module.exports = { getAllQuestions, addNewQuestion, softDeleteQuestion, getQuestion };
