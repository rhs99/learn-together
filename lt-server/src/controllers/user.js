const Util = require('../common/utils');
const UserService = require('../services/user');

const getUser = async (req, res) => {
    try {
        const user = await UserService.getUser(req.query.userName);
        res.status(200).json(user);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getNotifictions = async (req, res) => {
    try {
        const notifications = await UserService.getNotifications(req.query.userName);
        res.status(200).json(notifications);
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
        if (user) {
            const token = Util.createToken({ _id: user._id });
            res.status(200).json({ token, class: user.class });
        } else {
            res.status(401).json({ msg: 'login failed' });
        }
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

module.exports = {
    getUser,
    addNewUser,
    logInUser,
    updateClassInUser,
    updatePasswordInUser,
    updatePrivilege,
    getNotifictions,
};
