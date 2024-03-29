const AnswerService = require('../services/answer');

const getAnswer = async (req, res) => {
    try {
        const answer = await AnswerService.getAnswer(req.params._id);
        res.status(200).json(answer);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getAllAnswers = async (req, res) => {
    try {
        const answers = await AnswerService.getAllAnswers(req.query.questionId);
        res.status(200).json(answers);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addNewAnswer = async (req, res) => {
    try {
        req.body.user = req.user;
        await AnswerService.addNewAnswer(req.body);
        res.status(201).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const deleteAnswer = async (req, res) => {
    try {
        await AnswerService.deleteAnswer(req.params._id, req.user);
        res.status(200).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { getAllAnswers, addNewAnswer, getAnswer, deleteAnswer };
