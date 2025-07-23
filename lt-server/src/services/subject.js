const Subject = require('../models/subject');
const { getClass } = require('./class');
const { cacheService } = require('./cache');
const { NotFoundError, ValidationError, BadRequestError } = require('../common/error');

const CACHE_KEYS = {
    SUBJECT: 'subject',
    SUBJECT_PREFIX: 'subject:',
    SUBJECTS_BY_CLASS: 'subjects:class:',
    SUBJECT_BREADCRUMB: 'subject:breadcrumb:',
};

const getSubject = async (id) => {
    try {
        const cacheKey = `${CACHE_KEYS.SUBJECT_PREFIX}${id}`;
        const cachedSubject = await cacheService.get(cacheKey);

        if (cachedSubject) {
            return new Subject(cachedSubject);
        }

        const subject = await Subject.findById(id).populate('class').exec();

        if (!subject) {
            throw new NotFoundError('Subject not found');
        }

        await cacheService.set(cacheKey, subject.toObject(), 1800);

        return subject;
    } catch (error) {
        if (error.name === 'CastError') {
            throw new BadRequestError('Invalid subject ID format');
        }
        throw error;
    }
};

const getSubjectBreadcrumb = async (id) => {
    try {
        const cacheKey = `${CACHE_KEYS.SUBJECT_BREADCRUMB}${id}`;
        const cachedBreadcrumb = await cacheService.get(cacheKey);

        if (cachedBreadcrumb) {
            return cachedBreadcrumb;
        }

        const subject = await getSubject(id);

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
    } catch (error) {
        throw error;
    }
};

const getSubjects = async (classId) => {
    try {
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
    } catch (error) {
        if (error.name === 'CastError') {
            throw new BadRequestError('Invalid class ID format');
        }
        throw error;
    }
};

const addNewSubject = async (body) => {
    try {
        let subject = new Subject(body);
        subject = await subject.save();

        const _class = await getClass(body.class);
        _class.subjects.push(subject._id);
        await _class.save();

        await cacheService.del(`${CACHE_KEYS.SUBJECTS_BY_CLASS}${body.class}`);
        return subject;
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new ValidationError('Invalid subject data provided');
        }
        if (error.message === 'Class not found') {
            throw new NotFoundError('Referenced class does not exist');
        }
        throw error;
    }
};

module.exports = {
    getSubject,
    getSubjects,
    addNewSubject,
    getSubjectBreadcrumb,
};
