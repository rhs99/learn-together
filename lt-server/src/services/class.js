const Class = require('../models/class');

const getClasses = async () => {
    try {
        const classes = await Class.find({ isDeleted: false });
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

const softDeleteClass = async (body) => {
    try {
        const subjects = await Class.findOneAndUpdate({ name: body.name }, { isDeleted: true });
        return subjects;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};

module.exports = { getClasses, addNewClass, softDeleteClass };
