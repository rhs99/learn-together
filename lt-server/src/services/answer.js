const Answer = require('../models/answer');

const addNewAnswer = async (body) => {
    try {
        let answer;
        if (body._id !== '') {
            answer = await Answer.findOne({ _id: body._id }).exec();
            if (JSON.stringify(answer.user) !== JSON.stringify(body.user)) {
                throw new Error('unauthorized');
            }
            answer.details = body.details;
            answer.imageLocations = body.imageLocations;
        } else {
            delete body._id;
            answer = new Answer(body);
        }
        await answer.save();
    } catch (e) {
        console.log(e.message);
        if (e.message === 'unauthorized') {
            throw new Error();
        }
    }
};
const getAnswer = async (answerId) => {
    try {
        const answer = await Answer.findOne({ _id: answerId }).populate('user').exec();
        return answer;
    } catch (e) {
        console.log(e.message);
    }
};

const getAllAnswers = async (questionId) => {
    try {
        const answers = await Answer.find({ question: questionId }).populate('user').exec();
        return answers;
    } catch (e) {
        console.log(e.message);
    }
};

const deleteAnswer = async (answerId, user) => {
    try {
        const answer = await Answer.findById(answerId).exec();
        if (JSON.stringify(answer.user) !== JSON.stringify(user)) {
            throw new Error('unauth');
        }
        await Answer.deleteOne({ _id: answerId }).exec();
    } catch (e) {
        console.log(e.message);
        if (e.message === 'unauth') {
            throw new Error();
        }
    }
};

module.exports = { addNewAnswer, getAllAnswers, getAnswer, deleteAnswer };
