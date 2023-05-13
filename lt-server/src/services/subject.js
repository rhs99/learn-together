const Subject = require('../models/subject');

const getSubjects = async (classId) => {
    try {
        const subjects = await Subject.find({class: classId, isDeleted: false });
        return subjects;
    } catch (e) {
        console.log(e.message);
    }
};

const addNewSubject = async (body) => {
    try {
        const newSubject = new Subject(body);
        await newSubject.save();
    } catch (e) {
        console.log(e.message);
    }
};

const softDeleteSubject = async (_id) => {
    try {
        const subject = await Subject.findOneAndUpdate(
            { _id },
            { isDeleted: true },
            {
                new: true,
            },
        );
        return subject;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};
module.exports = { getSubjects, addNewSubject, softDeleteSubject };
