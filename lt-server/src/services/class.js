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

const softDeleteClass = async (_id) => {
    try {
        const _class = await Class.findOneAndUpdate(
            { _id },
            { isDeleted: true },
            {
                new: true,
            },
        );
        return _class;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};

module.exports = { getClasses, addNewClass, softDeleteClass };
