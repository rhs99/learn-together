const Privilege = require('../models/privilege');
const logger = require('../config/logger');

const getPrivileges = async () => {
    logger.database('Querying all privileges', 'privileges');
    const privileges = await Privilege.find().exec();
    logger.database('Privileges retrieved', 'privileges', { count: privileges.length });
    return privileges;
};

const addNewPrivilege = async (body) => {
    logger.database('Creating new privilege', 'privileges', { privilegeName: body.name });
    const newPrivilege = new Privilege(body);
    await newPrivilege.save();
    logger.database('Privilege created successfully', 'privileges', {
        privilegeId: newPrivilege._id,
        privilegeName: newPrivilege.name,
    });
};

module.exports = { getPrivileges, addNewPrivilege };
