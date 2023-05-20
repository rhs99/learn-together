const Question = require('../models/question');

const addNewQuestion = async (body) => {
    try {
        const newQuestion = new Question(body);
        await newQuestion.save();
    } catch (e) {
        console.log(e.message);
    }
};

const getAllQuestions = async (chapterId) => {
    try {
        const questions = await Question.find({ chapter: chapterId, isDeleted: false })
            .populate('tags')
            .populate('user')
            .exec();
        return questions;
    } catch (e) {
        console.log(e.message);
    }
};

const getQuestion = async (questionId) => {
    try {
        const question = await Question.findOne({ _id: questionId, isDeleted: false })
            .populate('tags')
            .populate('user')
            .exec();
        return question;
    } catch (e) {
        console.log(e.message);
    }
};

const softDeleteQuestion = async (_id) => {
    try {
        const question = await Question.findOneAndUpdate(
            { _id },
            { isDeleted: true },
            {
                new: true,
            },
        );
        return question;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};

module.exports = { addNewQuestion, getAllQuestions, softDeleteQuestion, getQuestion };
