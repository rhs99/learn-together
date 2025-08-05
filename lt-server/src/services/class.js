const Class = require('../models/class');
const { cacheService } = require('./cache');
const { NotFoundError, BadRequestError, ConflictError } = require('../common/error');
const logger = require('../config/logger');

const CACHE_KEYS = {
    CLASS: 'class',
    CLASSES: 'classes',
    CLASS_PREFIX: 'class:',
};

const getClass = async (id) => {
    try {
        const cacheKey = `${CACHE_KEYS.CLASS_PREFIX}${id}`;
        logger.debug('Fetching class', { classId: id, cacheKey });

        const cachedClass = await cacheService.get(cacheKey);

        if (cachedClass) {
            logger.debug('Class found in cache', { classId: id });
            return new Class(cachedClass);
        }

        logger.database('Querying class by ID', 'classes', { classId: id });
        const _class = await Class.findById(id).exec();

        if (!_class) {
            logger.warn('Class not found', { classId: id });
            throw new NotFoundError('Class not found');
        }

        await cacheService.set(cacheKey, _class.toObject(), 1800);
        logger.debug('Class cached successfully', { classId: id });

        return _class;
    } catch (error) {
        if (error.name === 'CastError') {
            logger.warn('Invalid class ID format', { classId: id });
            throw new BadRequestError('Invalid class ID format');
        }
        throw error;
    }
};

const getClasses = async () => {
    logger.debug('Fetching all classes');
    const cachedClasses = await cacheService.get(CACHE_KEYS.CLASSES);

    if (cachedClasses) {
        logger.debug('Classes found in cache', { count: cachedClasses.length });
        return cachedClasses.map((classData) => new Class(classData));
    }

    logger.database('Querying all classes', 'classes');
    const classes = await Class.find().exec();

    await cacheService.set(
        CACHE_KEYS.CLASSES,
        classes.map((c) => c.toObject()),
        600,
    );

    logger.debug('Classes cached successfully', { count: classes.length });
    return classes;
};

const addNewClass = async (body) => {
    try {
        logger.database('Creating new class', 'classes', { className: body.name });
        let newClass = new Class(body);
        newClass = await newClass.save();

        logger.debug('Invalidating class caches');
        await cacheService.del(CACHE_KEYS.CLASSES);
        await cacheService.del(`${CACHE_KEYS.CLASS_PREFIX}${newClass._id}`);

        logger.database('Class created successfully', 'classes', {
            classId: newClass._id,
            className: newClass.name,
        });
        return newClass;
    } catch (error) {
        if (error.code === 11000) {
            logger.warn('Class creation failed - duplicate name', { className: body.name });
            throw new ConflictError('Class with this name already exists');
        }
        logger.error('Class creation failed', { error: error.message, className: body.name });
        throw error;
    }
};

module.exports = {
    getClasses,
    addNewClass,
    getClass,
};
