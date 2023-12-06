const Class = require('../models/class');

const getClass = async (id) => {
    const _class = await Class.findById(id).exec();
    return _class;
};

const getClasses = async () => {
    const classes = await Class.find().exec();
    return classes;
};

const addNewClass = async (body) => {
    const newClass = new Class(body);
    await newClass.save();
};

module.exports = { getClasses, addNewClass, getClass };
