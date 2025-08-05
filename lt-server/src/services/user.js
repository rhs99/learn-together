const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Class = require('../models/class');
const Privilege = require('../models/privilege');
const Notification = require('../models/notification');
const { NotFoundError, UnauthorizedError, BadRequestError } = require('../common/error');
const logger = require('../config/logger');

const addNewUser = async (body) => {
    logger.info('Attempting to create new user', { userName: body.userName, email: body.email });

    const defaultPrivilege = await Privilege.findOne({ name: 'default' }).exec();
    if (!defaultPrivilege) {
        logger.error('Default privilege not found during user creation', { userName: body.userName });
        throw new NotFoundError('Default privilege not found. Cannot create user.');
    }

    const newUserInfo = {
        userName: body.userName,
        email: body.email,
        password: body.password,
        privileges: [defaultPrivilege._id],
    };

    if (body.class && body.class.trim().length > 0) {
        logger.debug('User class provided during registration', { userName: body.userName, classId: body.class });
        const _class = await Class.findById(body.class).exec();
        if (!_class) {
            logger.warn('Class not found during user creation', { userName: body.userName, classId: body.class });
            throw new NotFoundError(`Class not found: ${body.class}`);
        }
        newUserInfo.class = _class._id;
    }

    try {
        const user = new User(newUserInfo);
        await user.save();
        logger.info('User created successfully', {
            userName: body.userName,
            userId: user._id,
            hasClass: !!newUserInfo.class,
        });
    } catch (error) {
        logger.error('Failed to create user', {
            userName: body.userName,
            error: error.message,
            stack: error.stack,
        });
        throw new Error('Failed to create user.');
    }
};

const getUser = async (userName) => {
    const user = await User.findOne({ userName }).populate('privileges').select('-password').exec();
    if (!user) {
        throw new NotFoundError(`No user found for userName: ${userName}`);
    }
    let upVote = 0;
    let downVote = 0;
    let questions = [];
    let answers = [];

    try {
        logger.debug('Fetching user questions', { userName, questionCount: user.questions.length });
        const questionPromises = user.questions.map((question) => Question.findById(question).exec());
        questions = await Promise.all(questionPromises);
    } catch (error) {
        logger.error('Failed to fetch user questions', { userName, error: error.message });
        throw new Error('Failed to fetch user questions.');
    }

    try {
        logger.debug('Fetching user answers', { userName, answerCount: user.answers.length });
        const answerPromises = user.answers.map((answer) => Answer.findById(answer).exec());
        answers = await Promise.all(answerPromises);
    } catch (error) {
        logger.error('Failed to fetch user answers', { userName, error: error.message });
        throw new Error('Failed to fetch user answers.');
    }

    questions.forEach((question) => {
        if (question) {
            upVote += question.upVote || 0;
            downVote += question.downVote || 0;
        }
    });

    answers.forEach((answer) => {
        if (answer) {
            upVote += answer.upVote || 0;
            downVote += answer.downVote || 0;
        }
    });

    let _class = null;
    if (user.class) {
        try {
            logger.debug('Fetching user class', { userName, classId: user.class });
            _class = await Class.findById(user.class).exec();
        } catch (error) {
            logger.error('Failed to fetch user class', { userName, classId: user.class, error: error.message });
            throw new Error('Failed to fetch user class.');
        }
    }

    const userInfo = {
        questions: user.questions.length,
        answers: user.answers.length,
        privileges: user.privileges,
        userName: user.userName,
        upVote,
        downVote,
    };

    if (_class) {
        userInfo.class = _class.name;
    }

    return userInfo;
};

const logInUser = async (body) => {
    const user = await User.findOne({ userName: body.userName }).exec();
    if (!user) {
        throw new NotFoundError(`No user found for userName: ${body.userName}`);
    }
    const match = await user.comparePassword(body.password);
    if (match) {
        return user;
    }
    throw new UnauthorizedError('Incorrect password');
};

const updateClassInUser = async (body, req_user) => {
    logger.info('Attempting to update user class', { userName: body.userName, newClass: body._class });

    const user = await User.findOne({ userName: body.userName }).exec();
    if (!user) {
        logger.warn('User not found for class update', { userName: body.userName });
        throw new NotFoundError(`No user found for userName: ${body.userName}`);
    }
    if (JSON.stringify(user._id) !== JSON.stringify(req_user)) {
        logger.security('Unauthorized class update attempt', {
            userName: body.userName,
            requestingUserId: req_user,
            targetUserId: user._id,
        });
        throw new UnauthorizedError('You can only update your own class');
    }

    const oldClass = user.class;
    user.class = body._class;

    try {
        await user.save();
        logger.info('User class updated successfully', {
            userName: body.userName,
            oldClass,
            newClass: body._class,
        });
        return user;
    } catch (error) {
        logger.error('Failed to update user class', {
            userName: body.userName,
            error: error.message,
        });
        throw new Error('Failed to update user class.');
    }
};

const updatePasswordInUser = async (body, req_user) => {
    logger.info('Attempting to update user password', { userName: body.userName });

    const user = await User.findOne({ userName: body.userName }).exec();
    if (!user) {
        logger.warn('User not found for password update', { userName: body.userName });
        throw new NotFoundError(`No user found for userName: ${body.userName}`);
    }
    if (JSON.stringify(user._id) !== JSON.stringify(req_user)) {
        logger.security('Unauthorized password update attempt', {
            userName: body.userName,
            requestingUserId: req_user,
            targetUserId: user._id,
        });
        throw new UnauthorizedError('You can only update your own password');
    }

    const match = await user.comparePassword(body.prevPassword);

    if (!match) {
        logger.warn('Incorrect previous password provided', { userName: body.userName });
        throw new BadRequestError('Previous password is incorrect.');
    }

    user.password = body.password;

    try {
        await user.save();
        logger.info('User password updated successfully', { userName: body.userName });
        return user;
    } catch (error) {
        logger.error('Failed to update user password', {
            userName: body.userName,
            error: error.message,
        });
        throw new Error('Failed to update password.');
    }
};

const updatePrivilege = async (body) => {
    const user = await User.findOne({ userName: body.userName }).exec();
    if (!user) {
        throw new NotFoundError(`No user found for userName: ${body.userName}`);
    }
    const newPrivileges = body.privileges;
    newPrivileges.forEach((privilege) => {
        if (!user.privileges.includes(privilege)) {
            user.privileges.push(privilege);
        }
    });
    try {
        await user.save();
    } catch (err) {
        throw new Error('Failed to update user privileges: ' + err.message);
    }
};

const getNotifications = async (userName) => {
    logger.debug('Fetching notifications for user', { userName });

    const user = await User.findOne({ userName }).exec();
    if (!user) {
        logger.warn('User not found for notifications fetch', { userName });
        throw new NotFoundError(`No user found for userName: ${userName}`);
    }
    let notifications = [];
    try {
        notifications = await Notification.find({
            userId: user._id,
            read: false,
        })
            .sort({ createdAt: -1 })
            .exec();

        logger.debug('Notifications fetched successfully', {
            userName,
            notificationCount: notifications.length,
        });
    } catch (error) {
        logger.error('Failed to fetch notifications', { userName, error: error.message });
        throw new Error('Failed to fetch notifications');
    }
    return notifications;
};

const removeNotification = async (userName, notificationId) => {
    logger.debug('Removing notification', { userName, notificationId });

    const user = await User.findOne({ userName }).exec();
    if (!user) {
        logger.warn('User not found for notification removal', { userName, notificationId });
        throw new NotFoundError(`No user found for userName: ${userName}`);
    }
    const notification = await Notification.findById(notificationId).exec();
    if (!notification) {
        logger.warn('Notification not found', { userName, notificationId });
        throw new NotFoundError(`Notification not found for id: ${notificationId}`);
    }
    if (JSON.stringify(notification.userId) !== JSON.stringify(user._id)) {
        logger.security('Unauthorized notification removal attempt', {
            userName,
            notificationId,
            notificationUserId: notification.userId,
            requestingUserId: user._id,
        });
        throw new UnauthorizedError('You can only remove your own notifications');
    }
    notification.read = true;
    try {
        await notification.save();
        logger.info('Notification marked as read', { userName, notificationId });
    } catch (error) {
        logger.error('Failed to update notification', {
            userName,
            notificationId,
            error: error.message,
        });
        throw new Error('Failed to update notification.');
    }
};

const forgotPassword = async (body) => {
    const user = await User.findOne({ userName: body.userName, email: body.email }).exec();
    if (!user) {
        throw new NotFoundError(`No user found for userName: ${body.userName} and email: ${body.email}`);
    }
    return user;
};

const resetPassword = async (body) => {
    logger.info('Attempting to reset password', { userId: body.userId });

    const user = await User.findById(body.userId).exec();
    if (!user) {
        logger.warn('User not found for password reset', { userId: body.userId });
        throw new NotFoundError(`No user found for id: ${body.userId}`);
    }
    user.password = body.password;
    try {
        await user.save();
        logger.info('Password reset successfully', { userId: body.userId, userName: user.userName });
    } catch (error) {
        logger.error('Failed to reset password', { userId: body.userId, error: error.message });
        throw new Error('Failed to reset password.');
    }
    return user;
};

module.exports = {
    addNewUser,
    getUser,
    logInUser,
    updateClassInUser,
    updatePasswordInUser,
    updatePrivilege,
    getNotifications,
    removeNotification,
    forgotPassword,
    resetPassword,
};
