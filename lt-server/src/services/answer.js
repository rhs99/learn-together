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

const softDeleteAnswer = async (_id) => {
    try {
        const answer = await Answer.findOneAndUpdate(
            { _id },
            { isDeleted: true },
            {
                new: true,
            },
        );
        return answer;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};

module.exports = { addNewAnswer, getAllAnswers, softDeleteAnswer };
