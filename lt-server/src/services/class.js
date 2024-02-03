const Class = require('../models/class');

const { clearCache } = require('./cache');

const getClass = async (id) => {
    const _class = await Class.findById(id).cache({
        key: `classes-${id}`,
    });
    return _class;
};

const getClasses = async () => {
    const classes = await Class.find().cache({
        key: 'allClasses',
    });

    return classes;
};

const addNewClass = async (body) => {
    const newClass = new Class(body);
    await newClass.save();
    await clearCache('allClasses');
};

module.exports = { getClasses, addNewClass, getClass };
