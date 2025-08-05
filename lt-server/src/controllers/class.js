const ClassService = require('../services/class');
const logger = require('../config/logger');

const getClass = async (req, res) => {
    logger.debug('Fetching class details', { classId: req.params._id });
    const _class = await ClassService.getClass(req.params._id);
    res.status(200).json(_class);
};

const getClasses = async (req, res) => {
    logger.debug('Fetching all classes');
    const classes = await ClassService.getClasses();
    logger.debug('Classes fetched successfully', { classCount: classes.length });
    res.status(200).json(classes);
};

const addNewClass = async (req, res) => {
    logger.business('New class creation', { className: req.body.name });
    const newClass = await ClassService.addNewClass(req.body);
    logger.info('Class created successfully', { classId: newClass._id, className: newClass.name });
    res.status(201).json(newClass);
};

module.exports = { getClasses, addNewClass, getClass };
