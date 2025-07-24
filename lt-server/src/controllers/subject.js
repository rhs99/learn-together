const SubjectService = require('../services/subject');

const getSubjectBreadcrumb = async (req, res) => {
    const breadcrumbs = await SubjectService.getSubjectBreadcrumb(req.params._id);
    res.status(200).json(breadcrumbs);
};

const getSubjects = async (req, res) => {
    const subjects = await SubjectService.getSubjects(req.query.classId);
    res.status(200).json(subjects);
};

const addNewSubject = async (req, res) => {
    const newSubject = await SubjectService.addNewSubject(req.body);
    res.status(201).json(newSubject);
};

module.exports = { getSubjects, addNewSubject, getSubjectBreadcrumb };
