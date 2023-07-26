const Privilege = require('../models/privilege');

const getPrivileges = async () => {
    try {
        const privileges = await Privilege.find().exec();
        return privileges;
    } catch (e) {
        console.log(e.message);
        throw new Error('Unable to list privileges');
    }
};

const addNewPrivilege = async (body) => {
    try {
        const newPrivilege = new Privilege(body);
        await newPrivilege.save();
    } catch (e) {
        console.log(e.message);
        throw new Error('Failed to create privilege');
    }
};

module.exports = { getPrivileges, addNewPrivilege };
