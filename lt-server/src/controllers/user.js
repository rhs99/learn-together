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
        const authenticated = await UserService.logInUser(req.body);
        if (authenticated) {
            res.status(200).json();
        } else {
            res.status(401).json();
        }
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { getUser, addNewUser, logInUser };
