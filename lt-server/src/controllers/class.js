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
    logger.info('New class creation', {
        className: req.body.name,
        timestamp: new Date().toISOString(),
    });
    await ClassService.addNewClass(req.body);
    res.status(201).json();
};

module.exports = { getClasses, addNewClass, getClass };
