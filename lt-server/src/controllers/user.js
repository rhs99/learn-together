const { sendEmail } = require('../common/utils');
const Util = require('../common/utils');
const Config = require('../config');
const UserService = require('../services/user');

const getUser = async (req, res) => {
    const user = await UserService.getUser(req.params.userName);
    res.status(200).json(user);
};

const getNotifictions = async (req, res) => {
    const notifications = await UserService.getNotifications(req.params.userName);
    res.status(200).json(notifications);
};

const removeNotification = async (req, res) => {
    await UserService.removeNotification(req.params.userName, req.params.id);
    res.status(200).json();
};

const addNewUser = async (req, res) => {
    await UserService.addNewUser(req.body);
    res.status(201).json();
};

const logInUser = async (req, res) => {
    const user = await UserService.logInUser(req.body);
    if (!user) {
        throw new Error('Login failed!');
    }

    const token = Util.createToken({ _id: user._id });
    res.status(200).json({ token, class: user.class });
};

const updateClassInUser = async (req, res) => {
    await UserService.updateClassInUser(req.body, req.user);
    res.status(200).json();
};

const updatePasswordInUser = async (req, res) => {
    await UserService.updatePasswordInUser(req.body, req.user);
    res.status(200).json();
};

const updatePrivilege = async (req, res) => {
    await UserService.updatePrivilege(req.body);
    res.status(200).json();
};

const forgotPassword = async (req, res) => {
    const user = await UserService.forgotPassword(req.body);
    if (!user) {
        throw new Error('User not found!');
    }

    const token = Util.createTokenForPassword({ _id: user._id, email: user.email });
    const resetLink = `${Config.LT_HOST}/users/reset-password/${user._id}/${token}`;
    sendEmail(user.email, 'Reset password', resetLink);

    res.status(200).json({ token, userId: user._id });
};

const resetPassword = async (req, res) => {
    await UserService.resetPassword(req.body);
    res.status(200).json();
};

module.exports = {
    getUser,
    addNewUser,
    logInUser,
    updateClassInUser,
    updatePasswordInUser,
    updatePrivilege,
    getNotifictions,
    removeNotification,
    forgotPassword,
    resetPassword,
};
