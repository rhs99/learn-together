const ClassService = require('../services/class');
const handleError = require('../common/handleError');

const getClass = async (req, res) => {
    try {
        const _class = await ClassService.getClass(req.params._id);
        res.status(200).json(_class);
    } catch (error) {
        handleError(res, error, 'An error occurred while fetching the class');
    }
};

const getClasses = async (req, res) => {
    try {
        const classes = await ClassService.getClasses();
        res.status(200).json(classes);
    } catch (error) {
        handleError(res, error, 'An error occurred while fetching classes');
    }
};

const addNewClass = async (req, res) => {
    try {
        const newClass = await ClassService.addNewClass(req.body);
        res.status(201).json(newClass);
    } catch (error) {
        handleError(res, error, 'An error occurred while creating the class');
    }
};

module.exports = { getClasses, addNewClass, getClass };
