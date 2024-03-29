const SubjectService = require('../services/subject');

const getSubjectBreadcrumb = async (req, res) => {
    try {
        const subject = await SubjectService.getSubjectBreadcrumb(req.params._id);
        res.status(200).json(subject);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getSubjects = async (req, res) => {
    try {
        const subjects = await SubjectService.getSubjects(req.query.classId);
        res.status(200).json(subjects);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addNewSubject = async (req, res) => {
    try {
        await SubjectService.addNewSubject(req.body);
        res.status(201).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { getSubjects, addNewSubject, getSubjectBreadcrumb };
