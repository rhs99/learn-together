const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Class = require('../models/class');

const addNewUser = async (body) => {
    const newUserInfo = {
        userName: body.userName,
        email: body.email,
        password: body.password,
    };
    if (body.class && body.class.trim().length > 0) {
        newUserInfo.class = body.class;
    }
    const user = new User(newUserInfo);
    await user.save();
};

const getUser = async (userName) => {
    const user = await User.findOne({ userName }).populate('privileges').select('-password').exec();

    if (!user) {
        throw new Error('No user found');
    }

    let upVote = 0;
    let downVote = 0;

    const qPromises = user.questions.map((question) => {
        return Question.findById(question).exec();
    });
    const questions = await Promise.all(qPromises);

    const aPromises = user.answers.map((answer) => {
        return Answer.findById(answer).exec();
    });
    const answers = await Promise.all(aPromises);

    questions.forEach((q) => {
        upVote += q.upVote;
        downVote += q.downVote;
    });

    answers.forEach((a) => {
        upVote += a.upVote;
        downVote += a.downVote;
    });

    let _class = null;

    if (user.class) {
        _class = await Class.findById(user.class).exec();
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
        return null;
    }
    const match = await user.comparePassword(body.password);
    if (match) {
        return user;
    } else {
        return null;
    }
};

const updateClassInUser = async (body, req_user) => {
    const user = await User.findOne({ userName: body.userName }).exec();
    if (!user) {
        throw new Error('No user found!');
    }
    if (JSON.stringify(user._id) !== JSON.stringify(req_user)) {
        throw new Error('unauth');
    }

    user.class = body._class;
    await user.save();
    return user;
};

const updatePasswordInUser = async (body, req_user) => {
    const user = await User.findOne({ userName: body.userName }).exec();
    if (!user) {
        throw new Error('No user found!');
    }

    if (JSON.stringify(user._id) !== JSON.stringify(req_user)) {
        throw new Error('unauth');
    }

    const match = await user.comparePassword(body.prevPassword);

    if (match) {
        user.password = body.password;
        await user.save();
        return user;
    } else {
        throw new Error('Previous password is not correct!');
    }
};

const updatePrivilege = async (body) => {
    const user = await User.findOne({ userName: body.userName }).exec();
    if (!user) {
        throw new Error('No user found!');
    }
    const newPrivileges = body.privileges;
    newPrivileges.forEach((privilege) => {
        if (!user.privileges.includes(newPrivileges)) {
            user.privileges.push(privilege);
        }
    });
    await user.save();
};

const getNotifications = async (userName) => {
    const user = await User.findOne({ userName }).exec();
    if (!user) {
        return [];
    }
    return user.notifications;
};

const removeNotification = async (userName, qId) => {
    const user = await User.findOne({ userName }).exec();
    if (!user) {
        return [];
    }
    user.notifications = user.notifications.filter(
        (notification) => JSON.stringify(notification) !== JSON.stringify(qId),
    );
    await user.save();
};

const forgotPassword = async (body) => {
    const user = await User.findOne({ userName: body.userName }).exec();
    if (!user) {
        return null;
    }
    return user;
};

const resetPassword = async (body) => {
    const user = await User.findById(body.userId).exec();
    if (!user) {
        throw new Error('No user found!');
    }
    user.password = body.password;
    await user.save();
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
