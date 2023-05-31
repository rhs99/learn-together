const Class = require('../models/class');

const getClasses = async () => {
    try {
        const classes = await Class.find();
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

module.exports = { getClasses, addNewClass };
