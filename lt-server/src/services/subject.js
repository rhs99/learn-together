const Class = require('../models/class');
const Subject = require('../models/subject');

const getSubjects = async (classId) => {
    try {
        const subjects = await Subject.find({ class: classId, isDeleted: false });
        return subjects;
    } catch (e) {
        console.log(e.message);
    }
};

const addNewSubject = async (body) => {
    try {
        let subject = new Subject(body);
        subject = await subject.save();
        const _class = await Class.findById(body.class).exec();
        _class.subjects.push(subject._id);
        await _class.save();
    } catch (e) {
        console.log(e.message);
        if (e.message === 'unauthorized') {
            throw new Error();
        }
    }
};

const deleteSubject = async (_id) => {
    try {
        await Subject.deleteOne({ _id: _id }).exec();
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};
module.exports = { getSubjects, addNewSubject, deleteSubject };
