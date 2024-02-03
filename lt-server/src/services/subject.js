const Subject = require('../models/subject');
const { getClass } = require('./class');
const { clearCache } = require('./cache');

const getSubject = async (id) => {
    const subject = await Subject.findById(id).cache({
        key: `subjects-${id}`,
    });
    return subject;
};

const getSubjectBreadcrumb = async (id) => {
    const subject = await getSubject(id);
    const _class = await getClass(subject.class);

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
    const subjects = await Subject.find({ class: classId }).cache({
        key: `subjects-${classId}`,
    });
    return subjects;
};

const addNewSubject = async (body) => {
    let subject = new Subject(body);
    subject = await subject.save();
    const _class = await getClass(body.class);
    _class.subjects.push(subject._id);
    await _class.save();
    clearCache(`subjects-${body.class}`);
};

module.exports = { getSubject, getSubjects, addNewSubject, getSubjectBreadcrumb };
