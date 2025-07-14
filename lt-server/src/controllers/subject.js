const SubjectService = require('../services/subject');
const handleError = require('../common/handleError');

const getSubjectBreadcrumb = async (req, res) => {
    try {
        const breadcrumbs = await SubjectService.getSubjectBreadcrumb(req.params._id);
        res.status(200).json(breadcrumbs);
    } catch (error) {
        handleError(res, error, 'An error occurred while fetching subject breadcrumb');
    }
};

const getSubjects = async (req, res) => {
    try {
        const subjects = await SubjectService.getSubjects(req.query.classId);
        res.status(200).json(subjects);
    } catch (error) {
        handleError(res, error, 'An error occurred while fetching subjects');
    }
};

const addNewSubject = async (req, res) => {
    try {
        const newSubject = await SubjectService.addNewSubject(req.body);
        res.status(201).json(newSubject);
    } catch (error) {
        handleError(res, error, 'An error occurred while creating the subject');
    }
};

module.exports = { getSubjects, addNewSubject, getSubjectBreadcrumb };
