const AnswerService = require('../services/answer');

const getAllAnswers = async (req, res) => {
    try {
        const answers = await AnswerService.getAllAnswers();
        res.status(200).json(answers);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addNewAnswer = async (req, res) => {
    try {
        await AnswerService.addNewAnswer(req.body);
        res.status(201).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const softDeleteAnswer = async (req, res) => {
    try {
        const privileges = await AnswerService.softDeleteAnswer(req.body);
        res.status(200).json(privileges);
    } catch (e) {
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

module.exports = { getAllAnswers, addNewAnswer, softDeleteAnswer };
