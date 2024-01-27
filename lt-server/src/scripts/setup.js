const mongoose = require('mongoose');
const Privilege = require('../models/privilege');
const User = require('../models/user');

const DB_URL = process.env.MONGODB_URI;

const createAdminPrivilege = async () => {
    try {
        let adminPrivilege = await Privilege.findOne({ name: 'admin' }).exec();
        if (adminPrivilege) {
            return adminPrivilege;
        }
        adminPrivilege = new Privilege({ name: 'admin' });
        adminPrivilege = await adminPrivilege.save();
        return adminPrivilege;
    } catch (error) {
        throw new Error(error);
    }
};

const createDefaultPrivilege = async () => {
    try {
        let defaultPrivilege = await Privilege.findOne({ name: 'default' }).exec();
        if (defaultPrivilege) {
            return defaultPrivilege;
        }
        defaultPrivilege = new Privilege({ name: 'default' });
        defaultPrivilege = await defaultPrivilege.save();
        return defaultPrivilege;
    } catch (error) {
        throw new Error(error);
    }
};

const setup = async () => {
    try {
        await mongoose.connect(DB_URL, { dbName: 'lt-db' });
        const adminPrivilege = await createAdminPrivilege();

        const superUser = new User({
            userName: process.env.ADMIN_USERNAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            privileges: [adminPrivilege._id],
        });
        await superUser.save();

        await createDefaultPrivilege();

        mongoose.disconnect();
    } catch (error) {
        console.log(error);
    }
};

setup();
