const Answer = require('../models/answer');
const Question = require('../models/question');
const User = require('../models/user');
const Notification = require('../models/notification');
const Utils = require('../common/utils');
const { UnauthorizedError } = require('../common/error');
const connectedUsers = require('../common/connected-users');

const NOTIFICATION_TYPES = {
    NEW_ANSWER: 'new_answer',
};

const SOCKET_EVENTS = {
    NEW_ANSWER: 'new answer',
};

const normalizeImageLocations = (imageLocations = []) => {
    return imageLocations.map((fileName) => Utils.getFileUrl(fileName));
};

const validateUserOwnership = (resourceUserName, currentUserName, errorMessage) => {
    if (resourceUserName !== currentUserName) {
        throw new UnauthorizedError(errorMessage || 'Unauthorized: You do not have permission to perform this action');
    }
};

const addNewAnswer = async (body) => {
    if (!body.user || !body.question) {
        throw new Error('User ID and Question ID are required');
    }

    body.imageLocations = body.imageLocations || [];

    const [user, question] = await Promise.all([
        User.findById(body.user).exec(),
        Question.findById(body.question).exec(),
    ]);

    if (!user) throw new Error('User not found');
    if (!question) throw new Error('Question not found');

    const answer =
        body._id && body._id !== ''
            ? await updateExistingAnswer(body, user)
            : await createNewAnswer(body, user, question);

    await notifyQuestionOwner(question, user);

    return answer;
};

const updateExistingAnswer = async (body, user) => {
    const answer = await Answer.findById(body._id).exec();

    if (!answer) {
        throw new Error('Answer not found');
    }

    validateUserOwnership(answer.userName, user.userName, 'You can only edit your own answers');

    if (answer.imageLocations.length > 0 && body.imageLocations.length > 0) {
        Utils.deleteFile(answer.imageLocations);
    }

    answer.details = body.details || answer.details;
    answer.imageLocations = body.imageLocations.length === 0 ? answer.imageLocations : body.imageLocations;

    await answer.save();
    return answer;
};

const createNewAnswer = async (body, user, question) => {
    const answerData = {
        ...body,
        userName: user.userName,
        _id: undefined,
        user: undefined,
    };

    const answer = new Answer(answerData);
    const savedAnswer = await answer.save();

    await Promise.all([
        User.findByIdAndUpdate(user._id, { $push: { answers: savedAnswer._id } }),
        Question.findByIdAndUpdate(question._id, { $push: { answers: savedAnswer._id } }),
    ]);

    return savedAnswer;
};

const notifyQuestionOwner = async (question, answerAuthor) => {
    if (question.userName === answerAuthor.userName) {
        return;
    }

    const questionOwner = await User.findOne({ userName: question.userName }).exec();

    if (!questionOwner) {
        console.error(`Question owner not found: ${question.userName}`);
        return;
    }

    const notification = new Notification({
        userId: questionOwner._id,
        type: NOTIFICATION_TYPES.NEW_ANSWER,
        details: question._id,
        read: false,
    });

    await notification.save();

    const socket = connectedUsers.get(questionOwner.userName);
    if (socket) {
        socket.send(SOCKET_EVENTS.NEW_ANSWER);
    }
};

const getAnswer = async (answerId) => {
    if (!answerId) {
        throw new Error('Answer ID is required');
    }

    const answer = await Answer.findById(answerId).exec();

    if (!answer) {
        throw new Error('Answer not found');
    }

    return {
        ...answer.toObject(),
        imageLocations: normalizeImageLocations(answer.imageLocations),
    };
};

const getAllAnswers = async (questionId) => {
    if (!questionId) {
        throw new Error('Question ID is required');
    }

    const answers = await Answer.find({ question: questionId }).sort({ createdAt: -1 }).exec();

    return answers.map((answer) => ({
        ...answer.toObject(),
        imageLocations: normalizeImageLocations(answer.imageLocations),
    }));
};

const deleteAnswer = async (answerId, userId) => {
    if (!answerId || !userId) {
        throw new Error('Answer ID and User ID are required');
    }

    const answer = await Answer.findById(answerId).exec();
    if (!answer) {
        throw new Error('Answer not found');
    }

    const [question, user] = await Promise.all([
        Question.findById(answer.question).exec(),
        User.findById(userId).exec(),
    ]);

    if (!question) throw new Error('Question not found');
    if (!user) throw new Error('User not found');

    const isAnswerOwner = answer.userName === user.userName;
    const isQuestionOwner = question.userName === user.userName;

    if (!isAnswerOwner && !isQuestionOwner) {
        throw new UnauthorizedError('You can only delete your own answers or answers to your questions');
    }

    await Promise.all([
        Question.findByIdAndUpdate(question._id, { $pull: { answers: answerId } }),
        isAnswerOwner ? User.findByIdAndUpdate(userId, { $pull: { answers: answerId } }) : Promise.resolve(),
    ]);

    await Answer.deleteOne({ _id: answerId }).exec();

    if (answer.imageLocations && answer.imageLocations.length > 0) {
        Utils.deleteFile(answer.imageLocations);
    }
};

module.exports = {
    addNewAnswer,
    getAllAnswers,
    getAnswer,
    deleteAnswer,
};
