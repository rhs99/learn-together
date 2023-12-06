const Class = require('../models/class');
const Subject = require('../models/subject');

const getSubjectBreadcrumb = async (id) => {
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
};

const getSubjects = async (classId) => {
    const subjects = await Subject.find({ class: classId });
    return subjects;
};

const addNewSubject = async (body) => {
    let subject = new Subject(body);
    subject = await subject.save();
    const _class = await Class.findById(body.class).exec();
    _class.subjects.push(subject._id);
    await _class.save();
};

module.exports = { getSubjects, addNewSubject, getSubjectBreadcrumb };
