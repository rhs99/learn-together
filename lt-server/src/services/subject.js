const Subject = require('../models/subject');
const { getClass } = require('./class');
const { cacheService } = require('./cache');

const CACHE_KEYS = {
    SUBJECT: 'subject',
    SUBJECT_PREFIX: 'subject:',
    SUBJECTS_BY_CLASS: 'subjects:class:',
    SUBJECT_BREADCRUMB: 'subject:breadcrumb:',
};

const getSubject = async (id) => {
    const cacheKey = `${CACHE_KEYS.SUBJECT_PREFIX}${id}`;
    const cachedSubject = await cacheService.get(cacheKey);

    if (cachedSubject) {
        return new Subject(cachedSubject);
    }

    const subject = await Subject.findById(id).populate('class').exec();

    if (subject) {
        await cacheService.set(cacheKey, subject.toObject(), 1800);
    }

    return subject;
};

const getSubjectBreadcrumb = async (id) => {
    const cacheKey = `${CACHE_KEYS.SUBJECT_BREADCRUMB}${id}`;
    const cachedBreadcrumb = await cacheService.get(cacheKey);

    if (cachedBreadcrumb) {
        return cachedBreadcrumb;
    }

    const subject = await getSubject(id);

    // Safety check to prevent null reference errors
    if (!subject || !subject.class) {
        return [];
    }

    const breadcrumb = [
        {
            name: subject.class.name,
            url: `/classes/${subject.class._id}`,
        },
        {
            name: subject.name,
            url: '#',
        },
    ];

    await cacheService.set(cacheKey, breadcrumb, 3600);

    return breadcrumb;
};

const getSubjects = async (classId) => {
    const cacheKey = `${CACHE_KEYS.SUBJECTS_BY_CLASS}${classId}`;
    const cachedSubjects = await cacheService.get(cacheKey);

    if (cachedSubjects) {
        return cachedSubjects.map((subjectData) => new Subject(subjectData));
    }

    const subjects = await Subject.find({ class: classId }).exec();

    await cacheService.set(
        cacheKey,
        subjects.map((s) => s.toObject()),
        900,
    );

    return subjects;
};

const addNewSubject = async (body) => {
    let subject = new Subject(body);
    subject = await subject.save();
    const _class = await getClass(body.class);

    // Safety check to prevent null reference errors
    if (_class && _class.subjects) {
        _class.subjects.push(subject._id);
        await _class.save();
    }

    await cacheService.del(`${CACHE_KEYS.SUBJECTS_BY_CLASS}${body.class}`);
    return subject;
};

module.exports = {
    getSubject,
    getSubjects,
    addNewSubject,
    getSubjectBreadcrumb,
};
