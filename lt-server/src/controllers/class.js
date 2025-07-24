const ClassService = require('../services/class');

const getClass = async (req, res) => {
    const _class = await ClassService.getClass(req.params._id);
    res.status(200).json(_class);
};

const getClasses = async (req, res) => {
    const classes = await ClassService.getClasses();
    res.status(200).json(classes);
};

const addNewClass = async (req, res) => {
    const newClass = await ClassService.addNewClass(req.body);
    res.status(201).json(newClass);
};

module.exports = { getClasses, addNewClass, getClass };
