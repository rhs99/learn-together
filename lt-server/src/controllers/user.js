const Util = require('../utils');
const UserService = require('../services/user');

const getUser = async (req, res) => {
    try {
        const user = await UserService.getUser(req.query.userName);
        res.status(200).json(user);
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
            res.status(200).json({ token });
        } else {
            res.status(200).json({ msg: 'login failed' });
        }
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { getUser, addNewUser, logInUser };
