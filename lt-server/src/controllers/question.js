const QuestionService = require('../services/question');

const getAllQuestions = async (req, res) => {
    try {
        const questions = await QuestionService.getAllQuestions();
        res.status(200).json(questions);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addNewQuestion = async (req, res) => {
    try {
        await QuestionService.addNewQuestion(req.body);
        res.status(201).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { getAllQuestions, addNewQuestion };
