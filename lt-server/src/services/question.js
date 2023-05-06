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
        const questions = Question.find().exec();
        return questions;
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = { addNewQuestion, getAllQuestions };
