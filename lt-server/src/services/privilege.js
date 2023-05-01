const Privilege = require('../models/privilege');

const getPrivileges = async () => {
  try {
    const privileges = await Privilege.find();
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

module.exports = { getPrivileges, addNewPrivilege };
