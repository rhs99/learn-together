const express = require('express');
const router = express.Router();
const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const SubjectController = require('../controllers/subject');

router.get('/:id/breadcrumb', SubjectController.getSubjectBreadcrumb);
router.get('/list', SubjectController.getSubjects);
router.post('/create', extractAndVerifyToken, hasAdminPrivilege, SubjectController.addNewSubject);

module.exports = router;
