const mongoose = require('mongoose');
const Privilege = require('../models/privilege');
const User = require('../models/user');

const DB_URL = 'mongodb://mongo:27017/lt-db';

const createAdminPrivilege = async () => {
    try {
        let adminPrivilege = new Privilege({ name: 'admin' });
        adminPrivilege = await adminPrivilege.save();
        return adminPrivilege;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

const createAdminUser = async () => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const adminPrivilege = await createAdminPrivilege();

        const superUser = new User({
            userName: 'admin',
            email: 'lt@gmail.com',
            password: 'admin',
            privileges: [adminPrivilege._id],
        });
        await superUser.save();

        mongoose.disconnect();
    } catch (error) {
        console.log(error);
    }
};

createAdminUser();
