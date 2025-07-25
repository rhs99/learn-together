const Class = require('../models/class');
const { cacheService } = require('./cache');
const { NotFoundError, BadRequestError, ConflictError } = require('../common/error');

const CACHE_KEYS = {
    CLASS: 'class',
    CLASSES: 'classes',
    CLASS_PREFIX: 'class:',
};

const getClass = async (id) => {
    try {
        const cacheKey = `${CACHE_KEYS.CLASS_PREFIX}${id}`;
        const cachedClass = await cacheService.get(cacheKey);

        if (cachedClass) {
            return new Class(cachedClass);
        }

        const _class = await Class.findById(id).exec();

        if (!_class) {
            throw new NotFoundError('Class not found');
        }

        await cacheService.set(cacheKey, _class.toObject(), 1800);

        return _class;
    } catch (error) {
        if (error.name === 'CastError') {
            throw new BadRequestError('Invalid class ID format');
        }
        throw error;
    }
};

const getClasses = async () => {
    const cachedClasses = await cacheService.get(CACHE_KEYS.CLASSES);

    if (cachedClasses) {
        return cachedClasses.map((classData) => new Class(classData));
    }

    const classes = await Class.find().exec();

    await cacheService.set(
        CACHE_KEYS.CLASSES,
        classes.map((c) => c.toObject()),
        600,
    );

    return classes;
};

const addNewClass = async (body) => {
    try {
        let newClass = new Class(body);
        newClass = await newClass.save();

        await cacheService.del(CACHE_KEYS.CLASSES);
        await cacheService.del(`${CACHE_KEYS.CLASS_PREFIX}${newClass._id}`);

        return newClass;
    } catch (error) {
        if (error.code === 11000) {
            throw new ConflictError('Class with this name already exists');
        }
        throw error;
    }
};

module.exports = {
    getClasses,
    addNewClass,
    getClass,
};
