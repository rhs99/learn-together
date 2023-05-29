const Class = require('../models/class');
const Subject = require('../models/subject');

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

const deleteClass = async (classId) => {
    try {
        const _class = await Class.findOne({_id : classId }).exec();
        const promises = _class.subjets.map((_id)=>{
            return Subject.deleteOne({_id: _id}).exec();
        });
        await Class.deleteOne({ _id: classId }).exec();
        await Promise.all(promises);
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
        if (e.message === 'unauth') {
            throw new Error();
        }
    }
};

module.exports = { getClasses, addNewClass, deleteClass };
