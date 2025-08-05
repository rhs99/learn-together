const SubjectService = require('../services/subject');
const logger = require('../config/logger');

const getSubjectBreadcrumb = async (req, res) => {
    logger.debug('Fetching subject breadcrumb', { subjectId: req.params._id });
    const breadcrumbs = await SubjectService.getSubjectBreadcrumb(req.params._id);
    res.status(200).json(breadcrumbs);
};

const getSubjects = async (req, res) => {
    logger.debug('Fetching subjects', { classId: req.query.classId });
    const subjects = await SubjectService.getSubjects(req.query.classId);
    logger.debug('Subjects fetched successfully', {
        classId: req.query.classId,
        subjectCount: subjects.length,
    });
    res.status(200).json(subjects);
};

const addNewSubject = async (req, res) => {
    logger.business('New subject creation', {
        subjectName: req.body.name,
        classId: req.body.classId,
    });
    const newSubject = await SubjectService.addNewSubject(req.body);
    logger.info('Subject created successfully', {
        subjectId: newSubject._id,
        subjectName: newSubject.name,
    });
    res.status(201).json(newSubject);
};

module.exports = { getSubjects, addNewSubject, getSubjectBreadcrumb };
