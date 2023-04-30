import express from 'express';
const router = express.Router();

import SubjectController from '../controllers/subject';

router.get('/list', SubjectController.getSubjects);
router.post('/create', SubjectController.addNewSubject);

export default router;
