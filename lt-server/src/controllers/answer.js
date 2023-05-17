const AnswerService = require('../services/answer');

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

const softDeleteAnswer = async (req, res) => {
    try {
        const answer = await AnswerService.softDeleteAnswer(req.params._id);
        res.status(200).json(answer);
    } catch (e) {
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

module.exports = { getAllAnswers, addNewAnswer, softDeleteAnswer };
