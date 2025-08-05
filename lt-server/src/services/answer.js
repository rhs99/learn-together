const Answer = require('../models/answer');
const Question = require('../models/question');
const User = require('../models/user');
const Notification = require('../models/notification');
const Utils = require('../common/utils');
const { UnauthorizedError, NotFoundError } = require('../common/error');
const connectedUsers = require('../common/connected-users');
const logger = require('../config/logger');

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
    body.imageLocations = body.imageLocations || [];

    logger.info('Processing answer request', {
        userId: body.user,
        questionId: body.question,
        isUpdate: !!(body._id && body._id !== ''),
        hasImages: body.imageLocations.length > 0,
    });

    const [user, question] = await Promise.all([
        User.findById(body.user).exec(),
        Question.findById(body.question).exec(),
    ]);

    if (!user) {
        logger.warn('User not found for answer creation', { userId: body.user });
        throw new NotFoundError(`User not found for id: ${body.user}`);
    }
    if (!question) {
        logger.warn('Question not found for answer creation', { questionId: body.question });
        throw new NotFoundError(`Question not found for id: ${body.question}`);
    }

    const answer =
        body._id && body._id !== ''
            ? await updateExistingAnswer(body, user)
            : await createNewAnswer(body, user, question);

    await notifyQuestionOwner(question, user);

    logger.info('Answer processed successfully', {
        answerId: answer._id,
        userName: user.userName,
        questionId: question._id,
    });

    return answer;
};

const updateExistingAnswer = async (body, user) => {
    const answer = await Answer.findById(body._id).exec();
    if (!answer) {
        throw new NotFoundError(`Answer not found for id: ${body._id}`);
    }

    try {
        validateUserOwnership(answer.userName, user.userName, 'You can only edit your own answers');
    } catch {
        throw new UnauthorizedError('Unauthorized: You can only edit your own answers');
    }

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

    let savedAnswer;
    try {
        const answer = new Answer(answerData);
        savedAnswer = await answer.save();
    } catch (err) {
        throw new Error('Failed to create new answer: ' + err.message);
    }

    try {
        await Promise.all([
            User.findByIdAndUpdate(user._id, { $push: { answers: savedAnswer._id } }),
            Question.findByIdAndUpdate(question._id, { $push: { answers: savedAnswer._id } }),
        ]);
    } catch (err) {
        throw new Error('Failed to update user/question with new answer: ' + err.message);
    }

    return savedAnswer;
};

const notifyQuestionOwner = async (question, answerAuthor) => {
    if (question.userName === answerAuthor.userName) {
        return;
    }

    const questionOwner = await User.findOne({ userName: question.userName }).exec();

    if (!questionOwner) {
        throw new NotFoundError(`Question owner not found for userName: ${question.userName}`);
    }

    try {
        const notification = new Notification({
            userId: questionOwner._id,
            type: NOTIFICATION_TYPES.NEW_ANSWER,
            details: question._id,
            read: false,
        });
        await notification.save();
    } catch (err) {
        throw new Error('Failed to create notification: ' + err.message);
    }

    const socket = connectedUsers.get(questionOwner.userName);
    if (socket) {
        try {
            socket.send(SOCKET_EVENTS.NEW_ANSWER);
            logger.debug('Socket notification sent successfully', {
                recipient: questionOwner.userName,
                event: SOCKET_EVENTS.NEW_ANSWER,
            });
        } catch (err) {
            logger.error('Failed to send socket notification', {
                recipient: questionOwner.userName,
                event: SOCKET_EVENTS.NEW_ANSWER,
                error: err.message,
            });
        }
    } else {
        logger.debug('User not connected via socket', { userName: questionOwner.userName });
    }
};

const getAnswer = async (answerId) => {
    const answer = await Answer.findById(answerId).exec();
    if (!answer) {
        throw new NotFoundError(`Answer not found for id: ${answerId}`);
    }
    return {
        ...answer.toObject(),
        imageLocations: normalizeImageLocations(answer.imageLocations),
    };
};

const getAnswersByQuestion = async (questionId) => {
    try {
        logger.debug('Fetching answers for question', { questionId });
        const answers = await Answer.find({ question: questionId }).exec();
        logger.debug('Answers fetched successfully', { questionId, answerCount: answers?.length || 0 });
        return answers || [];
    } catch (error) {
        logger.error('Error fetching answers for question', { questionId, error: error.message });
        return [];
    }
};

const getAllAnswers = async (questionId) => {
    let answers;
    try {
        answers = await Answer.find({ question: questionId }).sort({ createdAt: -1 }).exec();
    } catch (err) {
        throw new Error('Failed to fetch answers for question: ' + err.message);
    }
    return answers.map((answer) => ({
        ...answer.toObject(),
        imageLocations: normalizeImageLocations(answer.imageLocations),
    }));
};

const deleteAnswer = async (answerId, userId) => {
    const answer = await Answer.findById(answerId).exec();
    if (!answer) {
        throw new NotFoundError(`Answer not found for id: ${answerId}`);
    }

    const [question, user] = await Promise.all([
        Question.findById(answer.question).exec(),
        User.findById(userId).exec(),
    ]);

    if (!question) throw new NotFoundError(`Question not found for id: ${answer.question}`);
    if (!user) throw new NotFoundError(`User not found for id: ${userId}`);

    const isAnswerOwner = answer.userName === user.userName;
    const isQuestionOwner = question.userName === user.userName;

    if (!isAnswerOwner && !isQuestionOwner) {
        throw new UnauthorizedError('Unauthorized: You can only delete your own answers or answers to your questions');
    }

    try {
        await Promise.all([
            Question.findByIdAndUpdate(question._id, { $pull: { answers: answerId } }),
            isAnswerOwner ? User.findByIdAndUpdate(userId, { $pull: { answers: answerId } }) : Promise.resolve(),
        ]);
    } catch (err) {
        throw new Error('Failed to update user/question when deleting answer: ' + err.message);
    }

    try {
        await Answer.deleteOne({ _id: answerId }).exec();
    } catch (err) {
        throw new Error('Failed to delete answer: ' + err.message);
    }

    if (answer.imageLocations && answer.imageLocations.length > 0) {
        try {
            Utils.deleteFile(answer.imageLocations);
            logger.debug('Answer images deleted successfully', {
                answerId,
                imageCount: answer.imageLocations.length,
            });
        } catch (err) {
            logger.error('Failed to delete answer images', {
                answerId,
                imageLocations: answer.imageLocations,
                error: err.message,
            });
        }
    }
};

module.exports = {
    addNewAnswer,
    getAllAnswers,
    getAnswer,
    getAnswersByQuestion,
    deleteAnswer,
};
