const Subject = require('../models/subject');
const { getClass } = require('./class');
const { cacheService } = require('./cache');
const { NotFoundError, ValidationError, BadRequestError } = require('../common/error');
const logger = require('../config/logger');

const CACHE_KEYS = {
    SUBJECT: 'subject',
    SUBJECT_PREFIX: 'subject:',
    SUBJECTS_BY_CLASS: 'subjects:class:',
    SUBJECT_BREADCRUMB: 'subject:breadcrumb:',
};

const getSubject = async (id) => {
    try {
        const cacheKey = `${CACHE_KEYS.SUBJECT_PREFIX}${id}`;
        logger.debug('Fetching subject', { subjectId: id, cacheKey });

        const cachedSubject = await cacheService.get(cacheKey);

        if (cachedSubject) {
            logger.debug('Subject found in cache', { subjectId: id });
            return new Subject(cachedSubject);
        }

        logger.database('Querying subject by ID', 'subjects', { subjectId: id });
        const subject = await Subject.findById(id).populate('class').exec();

        if (!subject) {
            logger.warn('Subject not found', { subjectId: id });
            throw new NotFoundError('Subject not found');
        }

        await cacheService.set(cacheKey, subject.toObject(), 1800);
        logger.debug('Subject cached successfully', { subjectId: id });

        return subject;
    } catch (error) {
        if (error.name === 'CastError') {
            logger.warn('Invalid subject ID format', { subjectId: id });
            throw new BadRequestError('Invalid subject ID format');
        }
        throw error;
    }
};

const getSubjectBreadcrumb = async (id) => {
    try {
        const cacheKey = `${CACHE_KEYS.SUBJECT_BREADCRUMB}${id}`;
        logger.debug('Fetching subject breadcrumb', { subjectId: id, cacheKey });

        const cachedBreadcrumb = await cacheService.get(cacheKey);

        if (cachedBreadcrumb) {
            logger.debug('Subject breadcrumb found in cache', { subjectId: id });
            return cachedBreadcrumb;
        }

        const subject = await getSubject(id);

        if (!subject || !subject.class) {
            logger.warn('Cannot build breadcrumb - subject or class missing', {
                subjectId: id,
                hasSubject: !!subject,
                hasClass: !!(subject && subject.class),
            });
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
        logger.debug('Subject breadcrumb cached successfully', { subjectId: id });

        return breadcrumb;
    } catch (error) {
        logger.error('Error building subject breadcrumb', {
            error: error.message,
            subjectId: id,
        });
        throw error;
    }
};

const getSubjects = async (classId) => {
    try {
        const cacheKey = `${CACHE_KEYS.SUBJECTS_BY_CLASS}${classId}`;
        logger.debug('Fetching subjects for class', { classId, cacheKey });

        const cachedSubjects = await cacheService.get(cacheKey);

        if (cachedSubjects) {
            logger.debug('Subjects found in cache', { classId, count: cachedSubjects.length });
            return cachedSubjects.map((subjectData) => new Subject(subjectData));
        }

        logger.database('Querying subjects by class', 'subjects', { classId });
        const subjects = await Subject.find({ class: classId }).exec();

        await cacheService.set(
            cacheKey,
            subjects.map((s) => s.toObject()),
            900,
        );

        logger.debug('Subjects cached successfully', { classId, count: subjects.length });
        return subjects;
    } catch (error) {
        if (error.name === 'CastError') {
            logger.warn('Invalid class ID format for subject query', { classId });
            throw new BadRequestError('Invalid class ID format');
        }
        logger.error('Error fetching subjects', { error: error.message, classId });
        throw error;
    }
};

const addNewSubject = async (body) => {
    try {
        logger.database('Creating new subject', 'subjects', {
            subjectName: body.name,
            classId: body.class,
        });
        let subject = new Subject(body);
        subject = await subject.save();

        logger.database('Adding subject to class', 'classes', {
            subjectId: subject._id,
            classId: body.class,
        });
        const _class = await getClass(body.class);
        _class.subjects.push(subject._id);
        await _class.save();

        logger.debug('Invalidating subject cache for class', { classId: body.class });
        await cacheService.del(`${CACHE_KEYS.SUBJECTS_BY_CLASS}${body.class}`);

        logger.database('Subject created successfully', 'subjects', {
            subjectId: subject._id,
            subjectName: subject.name,
        });
        return subject;
    } catch (error) {
        if (error.name === 'ValidationError') {
            logger.warn('Subject creation failed - validation error', {
                error: error.message,
                subjectData: body,
            });
            throw new ValidationError('Invalid subject data provided');
        }
        if (error.message === 'Class not found') {
            logger.warn('Subject creation failed - class not found', { classId: body.class });
            throw new NotFoundError('Referenced class does not exist');
        }
        logger.error('Subject creation failed', { error: error.message, subjectData: body });
        throw error;
    }
};

module.exports = {
    getSubject,
    getSubjects,
    addNewSubject,
    getSubjectBreadcrumb,
};
