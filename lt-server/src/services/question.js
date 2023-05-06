const Question = require('../models/question');

const addNewQuestion = async (body) => {
    try {
        const newQuestion = new Question(body);
        await newQuestion.save();
    } catch (e) {
        console.log(e.message);
    }
};

const getAllQuestions = async () => {
    try {
        const questions = Question.find({ isDeleted: false }).exec();
        return questions;
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

module.exports = { addNewQuestion, getAllQuestions, softDeleteQuestion };
