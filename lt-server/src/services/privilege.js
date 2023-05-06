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

const softDeletePrivilege = async (_id) => {
    try {
        const privilege = await Privilege.findOneAndUpdate(
            { _id },
            { isDeleted: true },
            {
                new: true,
            },
        );
        return privilege;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};

module.exports = { getPrivileges, addNewPrivilege, softDeletePrivilege };
