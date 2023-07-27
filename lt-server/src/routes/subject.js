const express = require('express');
const router = express.Router();
const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const SubjectController = require('../controllers/subject');

router.get('/', SubjectController.getSubjects);
router.get('/:_id/breadcrumb', SubjectController.getSubjectBreadcrumb);
router.post('/', extractAndVerifyToken, hasAdminPrivilege, SubjectController.addNewSubject);

module.exports = router;
