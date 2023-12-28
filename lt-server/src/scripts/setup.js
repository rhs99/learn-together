const mongoose = require('mongoose');
const Privilege = require('../models/privilege');
const User = require('../models/user');
const Class = require('../models/class');
const Subject = require('../models/subject');
const Chapter = require('../models/chapter');

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

const createOneClassSubjectChapter = async () => {
    try {
        let cls = new Class({ name: '8' });
        cls = await cls.save();

        let subject = new Subject({ name: 'Math', class: cls._id });
        subject = await subject.save();

        const chapter = new Chapter({ name: 'Geometry', subject: subject._id });
        await chapter.save();
    } catch (error) {
        console.log(error);
    }
};

const setup = async () => {
    try {
        await mongoose.connect(DB_URL, {dbName: 'lt-db'});
        const adminPrivilege = await createAdminPrivilege();

        const superUser = new User({
            userName: process.env.ADMIN_USERNAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            privileges: [adminPrivilege._id],
        });
        await superUser.save();

        const testUser = new User({
            userName: 'test',
            email: 'test@gmail.com',
            password: '123',
        });
        await testUser.save();

        await createOneClassSubjectChapter();

        mongoose.disconnect();
    } catch (error) {
        console.log(error);
    }
};

setup();
