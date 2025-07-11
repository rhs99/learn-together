const express = require('express');
const router = express.Router();
const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');
const { validate } = require('../common/validation');
const { getSubjectBreadcrumbSchema, getSubjectsSchema, createSubjectSchema } = require('../validations/subject');

const SubjectController = require('../controllers/subject');

router.get('/', validate(getSubjectsSchema), SubjectController.getSubjects);
router.get('/:_id/breadcrumb', validate(getSubjectBreadcrumbSchema), SubjectController.getSubjectBreadcrumb);
router.post(
    '/',
    extractAndVerifyToken,
    hasAdminPrivilege,
    validate(createSubjectSchema),
    SubjectController.addNewSubject,
);

module.exports = router;
