const Class = require('../models/class');

const getClass = async (id) => {
    try {
        const _class = await Class.findById(id).exec();
        return _class;
    } catch (e) {
        console.log(e.message);
    }
};

const getClasses = async () => {
    try {
        const classes = await Class.find().exec();
        return classes;
    } catch (e) {
        console.log(e.message);
    }
};

const addNewClass = async (body) => {
    try {
        const newClass = new Class(body);
        await newClass.save();
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = { getClasses, addNewClass, getClass };
