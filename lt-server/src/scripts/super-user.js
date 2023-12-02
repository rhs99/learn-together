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
        console.log(error);
        throw new Error(error);
    }
};

const createAdminUser = async () => {
    try {
        await mongoose.connect(DB_URL);
        const adminPrivilege = await createAdminPrivilege();

        const superUser = new User({
            userName: process.env.ADMIN_USERNAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            privileges: [adminPrivilege._id],
        });
        await superUser.save();

        mongoose.disconnect();
    } catch (error) {
        console.log(error);
    }
};

createAdminUser();
