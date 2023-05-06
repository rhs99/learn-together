const Privilege = require('../models/privilege');

const getPrivileges = async () => {
    try {
        const privileges = await Privilege.find({ isDeleted: false });
        return privileges;
    } catch (e) {
        console.log(e.message);
    }
};

const addNewPrivilege = async (body) => {
    try {
        const newPrivilege = new Privilege(body);
        await newPrivilege.save();
    } catch (e) {
        console.log(e.message);
    }
};

const softDeletePrivilege = async (body) => {
    try {
        const subjects = await Privilege.findOneAndUpdate({ name: body.name }, { isDeleted: true });
        return subjects;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};

module.exports = { getPrivileges, addNewPrivilege, softDeletePrivilege };
