const Answer = require('../models/answer');
const Question = require('../models/question');
const User = require('../models/user');

const connectedUsers = require('../common/connected-users');

const addNewAnswer = async (body) => {
    try {
        const user = await User.findById(body.user).exec();
        const question = await Question.findById(body.question).exec();

        let answer;
        if (body._id !== '') {
            answer = await Answer.findOne({ _id: body._id }).exec();
            if (answer.userName !== user.userName) {
                throw new Error('unauthorized');
            }
            answer.details = body.details;
            answer.imageLocations = body.imageLocations;
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
    } catch (e) {
        console.log(e.message);
        if (e.message === 'unauthorized') {
            throw new Error();
        }
    }
};
const getAnswer = async (answerId) => {
    try {
        const answer = await Answer.findOne({ _id: answerId }).exec();
        return answer;
    } catch (e) {
        console.log(e.message);
    }
};

const getAllAnswers = async (questionId) => {
    try {
        const answers = await Answer.find({ question: questionId }).exec();
        return answers;
    } catch (e) {
        console.log(e.message);
    }
};

const deleteAnswer = async (answerId, userId) => {
    try {
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
    } catch (e) {
        console.log(e.message);
        if (e.message === 'unauth') {
            throw new Error();
        }
    }
};

module.exports = { addNewAnswer, getAllAnswers, getAnswer, deleteAnswer };
