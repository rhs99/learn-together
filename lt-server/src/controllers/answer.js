const AnswerService = require('../services/answer');

const getAnswer = async (req, res) => {
    const answer = await AnswerService.getAnswer(req.params._id);
    res.status(200).json(answer);
};

const getAllAnswers = async (req, res) => {
    const answers = await AnswerService.getAllAnswers(req.query.questionId);
    res.status(200).json(answers);
};

const addNewAnswer = async (req, res) => {
    req.body.user = req.user;
    await AnswerService.addNewAnswer(req.body);
    res.status(201).json();
};

const deleteAnswer = async (req, res) => {
    await AnswerService.deleteAnswer(req.params._id, req.user);
    res.status(200).json();
};

module.exports = { getAllAnswers, addNewAnswer, getAnswer, deleteAnswer };
