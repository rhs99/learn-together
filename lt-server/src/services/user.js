const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Class = require('../models/class');

const addNewUser = async (body) => {
    try {
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
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Username Exists');
        } else {
            console.log(error.message);
            throw new Error(error.message);
        }
    }
};

const getUser = async (userName) => {
    try {
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
    } catch (error) {
        console.log(error.message);
    }
};

const logInUser = async (body) => {
    try {
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
    } catch (error) {
        console.log(error.message);
    }
};

const updateClassInUser = async (body, req_user) => {
    try {
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
    } catch (error) {
        console.log(error.message);
        throw new Error(error);
    }
};

const updatePasswordInUser = async (body, req_user) => {
    try {
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
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

const updatePrivilege = async (body) => {
    try {
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
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

module.exports = { addNewUser, getUser, logInUser, updateClassInUser, updatePasswordInUser, updatePrivilege };
