const Answer = require('../models/answer');
const Question = require('../models/question');
const User = require('../models/user');
const Utils = require('../common/utils');
const { UnauthorizedError } = require('../common/error');

const connectedUsers = require('../common/connected-users');

const addNewAnswer = async (body) => {
    const user = await User.findById(body.user).exec();
    const question = await Question.findById(body.question).exec();
    body.imageLocations = body.imageLocations || [];

    let answer;
    if (body._id !== '') {
        answer = await Answer.findOne({ _id: body._id }).exec();
        if (answer.userName !== user.userName) {
            throw new UnauthorizedError();
        }
        if (answer.imageLocations.length > 0 && body.imageLocations.length > 0) {
            Utils.deleteFile(answer.imageLocations);
        }
        answer.details = body.details || answer.details;
        answer.imageLocations = body.imageLocations.length === 0 ? answer.imageLocations : body.imageLocations;
        await answer.save();
    } else {
        delete body._id;
        delete body.user;
        body.userName = user.userName;

        answer = new Answer(body);
        answer = await answer.save();
        user.answers.push(answer._id);
        await user.save();
        question.answers.push(answer._id);
        await question.save();
    }
    const qOwner = await User.findOne({ userName: question.userName }).exec();
    if (!qOwner.notifications.includes(question._id)) {
        qOwner.notifications.push(question._id);
    }
    if (qOwner.notifications.length > 10) {
        qOwner.notifications = qOwner.notifications.slice(1);
    }
    await qOwner.save();
    const socket = connectedUsers.get(qOwner.userName);
    if (socket) {
        socket.send('new answer');
    }
};

const getAnswer = async (answerId) => {
    const answer = await Answer.findOne({ _id: answerId }).exec();
    return answer;
};

const getAllAnswers = async (questionId) => {
    const answers = await Answer.find({ question: questionId }).exec();
    const resp = answers.map((answer) => {
        answer.imageLocations = answer.imageLocations.map((fileName) => {
            return Utils.getFileUrl(fileName);
        });
        return {
            ...answer._doc,
        };
    });
    return resp;
};

const deleteAnswer = async (answerId, userId) => {
    const answer = await Answer.findById(answerId).exec();
    const question = await Question.findById(answer.question).exec();
    const user = await User.findById(userId).exec();

    if (answer.userName !== user.userName && question.userName !== user.userName) {
        throw new Error('unauth');
    }
    question.answers = question.answers.filter((q) => JSON.stringify(q) !== JSON.stringify(answer._id));
    await question.save();
    user.answers = user.answers.filter((item) => JSON.stringify(item) !== JSON.stringify(answerId));
    await user.save();
    await Answer.deleteOne({ _id: answerId }).exec();
    Utils.deleteFile(answer.imageLocations);
};

module.exports = { addNewAnswer, getAllAnswers, getAnswer, deleteAnswer };
