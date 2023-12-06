const Privilege = require('../models/privilege');

const getPrivileges = async () => {
    const privileges = await Privilege.find().exec();
    return privileges;
};

const addNewPrivilege = async (body) => {
    const newPrivilege = new Privilege(body);
    await newPrivilege.save();
};

module.exports = { getPrivileges, addNewPrivilege };
