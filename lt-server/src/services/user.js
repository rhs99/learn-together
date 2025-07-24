const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Class = require('../models/class');
const Privilege = require('../models/privilege');
const Notification = require('../models/notification');
const { NotFoundError, UnauthorizedError, BadRequestError } = require('../common/error');

const addNewUser = async (body) => {
    const defaultPrivilege = await Privilege.findOne({ name: 'default' }).exec();
    if (!defaultPrivilege) {
        throw new NotFoundError('Default privilege not found. Cannot create user.');
    }

    const newUserInfo = {
        userName: body.userName,
        email: body.email,
        password: body.password,
        privileges: [defaultPrivilege._id],
    };

    if (body.class && body.class.trim().length > 0) {
        const _class = await Class.findById(body.class).exec();
        if (!_class) {
            throw new NotFoundError(`Class not found: ${body.class}`);
        }
        newUserInfo.class = _class._id;
    }

    try {
        const user = new User(newUserInfo);
        await user.save();
    } catch (error) {
        console.error('Failed to create user:', error);
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
        const questionPromises = user.questions.map((question) => Question.findById(question).exec());
        questions = await Promise.all(questionPromises);
    } catch (error) {
        console.error('Failed to fetch user questions:', error);
        throw new Error('Failed to fetch user questions.');
    }

    try {
        const answerPromises = user.answers.map((answer) => Answer.findById(answer).exec());
        answers = await Promise.all(answerPromises);
    } catch (error) {
        console.error('Failed to fetch user answers:', error);
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
            _class = await Class.findById(user.class).exec();
        } catch (error) {
            console.error('Failed to fetch user class:', error);
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
    const user = await User.findOne({ userName: body.userName }).exec();
    if (!user) {
        throw new NotFoundError(`No user found for userName: ${body.userName}`);
    }
    if (JSON.stringify(user._id) !== JSON.stringify(req_user)) {
        throw new UnauthorizedError('You can only update your own class');
    }

    user.class = body._class;

    try {
        await user.save();
        return user;
    } catch (error) {
        console.error('Failed to update user class:', error);
        throw new Error('Failed to update user class.');
    }
};

const updatePasswordInUser = async (body, req_user) => {
    const user = await User.findOne({ userName: body.userName }).exec();
    if (!user) {
        throw new NotFoundError(`No user found for userName: ${body.userName}`);
    }
    if (JSON.stringify(user._id) !== JSON.stringify(req_user)) {
        throw new UnauthorizedError('You can only update your own password');
    }

    const match = await user.comparePassword(body.prevPassword);

    if (!match) {
        throw new BadRequestError('Previous password is incorrect.');
    }

    user.password = body.password;

    try {
        await user.save();
        return user;
    } catch (error) {
        console.error('Failed to update user password:', error);
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
    const user = await User.findOne({ userName }).exec();
    if (!user) {
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
    } catch (error) {
        console.error('Failed to fetch notifications: ', error);
        throw new Error('Failed to fetch notifications');
    }
    return notifications;
};

const removeNotification = async (userName, notificationId) => {
    const user = await User.findOne({ userName }).exec();
    if (!user) {
        throw new NotFoundError(`No user found for userName: ${userName}`);
    }
    const notification = await Notification.findById(notificationId).exec();
    if (!notification) {
        throw new NotFoundError(`Notification not found for id: ${notificationId}`);
    }
    if (JSON.stringify(notification.userId) !== JSON.stringify(user._id)) {
        throw new UnauthorizedError('You can only remove your own notifications');
    }
    notification.read = true;
    try {
        await notification.save();
    } catch (error) {
        console.error('Failed to update notification:', error);
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
    const user = await User.findById(body.userId).exec();
    if (!user) {
        throw new NotFoundError(`No user found for id: ${body.userId}`);
    }
    user.password = body.password;
    try {
        await user.save();
    } catch (error) {
        console.error('Failed to reset password:', error);
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
