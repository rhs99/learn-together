const express = require('express');
const router = express.Router();

const SubjectController = require('../controllers/subject');

router.get('/list', SubjectController.getSubjects);
router.post('/create', SubjectController.addNewSubject);

module.exports = router;