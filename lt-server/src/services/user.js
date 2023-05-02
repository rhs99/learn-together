const User = require('../models/user');

const addNewUser = async (body) => {
    try {
        const user = new User(body);
        await user.save();
    } catch (error) {
        console.log(error.message);
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
            throw new Error('No user found');
        }
        return user.comparePassword(body.password);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { addNewUser, getUser, logInUser };
