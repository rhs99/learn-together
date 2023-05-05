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
        const answers = Answer.find({ isDeleted: false }).exec();
        return answers;
    } catch (e) {
        console.log(e.message);
    }
};

const softDeleteAnswer = async (body) => {
    try {
        const subjects = await Answer.findOneAndUpdate({ name: body.name, subject: body.subject }, { isDeleted: true });
        return subjects;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};

module.exports = { addNewAnswer, getAllAnswers, softDeleteAnswer };
