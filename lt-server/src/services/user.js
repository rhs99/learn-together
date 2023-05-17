const User = require('../models/user');

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
        const user = await User.find({ userName }).select('-password').exec();
        return user;
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

module.exports = { addNewUser, getUser, logInUser };
