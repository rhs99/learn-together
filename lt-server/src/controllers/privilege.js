const PrivilegeService = require('../services/privilege');

const getPrivileges = async (req, res) => {
    try {
        const privileges = await PrivilegeService.getPrivileges();
        res.status(200).json(privileges);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addNewPrivilege = async (req, res) => {
    try {
        await PrivilegeService.addNewPrivilege(req.body);
        res.status(201).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { getPrivileges, addNewPrivilege };
