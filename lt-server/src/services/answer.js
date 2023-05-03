const Answer = require('../models/answer');

const addNewAnswer = async (body) => {
    try {
        const newAnswer = new Answer(body);
        await newAnswer.save();
    } catch (e) {
        console.log(e.message);
    }
};

const getAllAnswers = async () => {
    try {
        const answers = Answer.find().exec();
        return answers;
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = { addNewAnswer, getAllAnswers };
