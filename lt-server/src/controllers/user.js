const { sendEmail } = require('../common/utils');
const Util = require('../common/utils');
const UserService = require('../services/user');

const getUser = async (req, res) => {
    try {
        const user = await UserService.getUser(req.params.userName);
        res.status(200).json(user);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getNotifictions = async (req, res) => {
    try {
        const notifications = await UserService.getNotifications(req.params.userName);
        res.status(200).json(notifications);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const removeNotification = async (req, res) => {
    try {
        await UserService.removeNotification(req.params.userName, req.params.qId);
        res.status(200).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addNewUser = async (req, res) => {
    try {
        await UserService.addNewUser(req.body);
        res.status(201).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const logInUser = async (req, res) => {
    try {
        const user = await UserService.logInUser(req.body);
        if (!user) {
            throw new Error('Login failed!');
        }

        const token = Util.createToken({ _id: user._id });
        res.status(200).json({ token, class: user.class });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const updateClassInUser = async (req, res) => {
    try {
        await UserService.updateClassInUser(req.body, req.user);
        res.status(200).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const updatePasswordInUser = async (req, res) => {
    try {
        await UserService.updatePasswordInUser(req.body, req.user);
        res.status(200).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const updatePrivilege = async (req, res) => {
    try {
        await UserService.updatePrivilege(req.body);
        res.status(200).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const user = await UserService.forgotPassword(req.body);
        if (!user) {
            throw new Error('User not found!');
        }

        const token = Util.createTokenForPassword({ _id: user._id, email: user.email });
        const resetLink = `http://localhost:3000/users/reset-password/${user._id}/${token}`;
        sendEmail(user.email, 'Reset password', resetLink);

        res.status(200).json({ token, userId: user._id });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        await UserService.resetPassword(req.body);
        res.status(200).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
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
