const Subject = require('../models/subject');

const getSubjects = async () => {
    try {
        const subjects = await Subject.find({ isDeleted: false });
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

const softDeleteSubject = async (body) => {
    try {
        const subjects = await Subject.findOneAndUpdate({ name: body.name, class: body.class }, { isDeleted: true });
        return subjects;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};
module.exports = { getSubjects, addNewSubject, softDeleteSubject };
