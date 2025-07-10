const Class = require('../models/class');
const { cacheService, clearCache } = require('./cache');

const CACHE_KEYS = {
    CLASS: 'class',
    CLASSES: 'classes',
    CLASS_PREFIX: 'class:',
};

const getClass = async (id) => {
    const cacheKey = `${CACHE_KEYS.CLASS_PREFIX}${id}`;
    const cachedClass = await cacheService.get(cacheKey);

    if (cachedClass) {
        return new Class(cachedClass);
    }

    const _class = await Class.findById(id).exec();

    if (_class) {
        await cacheService.set(cacheKey, _class.toObject(), 1800);
    }

    return _class;
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
    const newClass = new Class(body);
    await newClass.save();

    await cacheService.del(CACHE_KEYS.CLASSES);
    await cacheService.del(`${CACHE_KEYS.CLASS_PREFIX}${newClass._id}`);
};

module.exports = {
    getClasses,
    addNewClass,
    getClass,
};
