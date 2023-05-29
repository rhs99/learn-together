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
        let subject;
        if (body._id !== '') {
            subject = await Subject.findOne({ _id: body._id }).exec();
        } else {
            delete body._id;
            subject = new Subject(body);
        }
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
