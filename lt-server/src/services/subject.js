const Class = require('../models/class');
const Subject = require('../models/subject');

const getSubjectBreadcrumb = async (id) => {
    try {
        const subject = await Subject.findById(id).exec();
        const _class = await Class.findById(subject.class).exec();
        return [
            {
                name: _class.name,
                url: `/classes/${_class._id}`,
            },
            {
                name: subject.name,
                url: '#',
            },
        ];
    } catch (e) {
        console.log(e.message);
    }
};

const getSubjects = async (classId) => {
    try {
        const subjects = await Subject.find({ class: classId });
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

module.exports = { getSubjects, addNewSubject, getSubjectBreadcrumb };
