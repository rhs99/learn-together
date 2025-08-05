const PrivilegeService = require('../services/privilege');
const logger = require('../config/logger');

const getPrivileges = async (req, res) => {
    logger.debug('Fetching all privileges');
    const privileges = await PrivilegeService.getPrivileges();
    logger.debug('Privileges fetched successfully', { privilegeCount: privileges.length });
    res.status(200).json(privileges);
};

const addNewPrivilege = async (req, res) => {
    logger.business('New privilege creation', { privilegeName: req.body.name });
    await PrivilegeService.addNewPrivilege(req.body);
    logger.info('Privilege created successfully', { privilegeName: req.body.name });
    res.status(201).json();
};

module.exports = { getPrivileges, addNewPrivilege };
