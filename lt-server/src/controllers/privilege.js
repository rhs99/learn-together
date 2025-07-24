const PrivilegeService = require('../services/privilege');

const getPrivileges = async (req, res) => {
    const privileges = await PrivilegeService.getPrivileges();
    res.status(200).json(privileges);
};

const addNewPrivilege = async (req, res) => {
    await PrivilegeService.addNewPrivilege(req.body);
    res.status(201).json();
};

module.exports = { getPrivileges, addNewPrivilege };
