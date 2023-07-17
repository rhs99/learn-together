const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Privilege = require('../models/privilege');

const addNewUser = async (body) => {
    try {
        const user = new User(body);
        await user.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Username Exists');
        } else {
            console.log(error.message);
        }
    }
};

const getUser = async (userName) => {
    try {
        const user = await User.findOne({ userName }).populate('class').select('-password').exec();
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

        const pPromises = user.privileges.map((privilege) => {
            return Privilege.findById(privilege).exec();
        });
        const privileges = await Promise.all(pPromises);

        questions.forEach((q) => {
            upVote += q.upVote;
            downVote += q.downVote;
        });

        answers.forEach((a) => {
            upVote += a.upVote;
            downVote += a.downVote;
        });

        return {
            questions: user.questions.length,
            answers: user.answers.length,
            privileges,
            userName: user.userName,
            class: user.class.name,
            upVote,
            downVote,
        };
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
        newPrivileges.forEach((privilege)=>{
            if(!user.privileges.includes(newPrivileges)){
                user.privileges.push(privilege);
            }
        })
        await user.save();
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

module.exports = { addNewUser, getUser, logInUser, updateClassInUser, updatePasswordInUser, updatePrivilege };
