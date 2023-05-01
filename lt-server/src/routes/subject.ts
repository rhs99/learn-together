import express from 'express';
const router = express.Router();

import SubjectController from '../controllers/subject';

router.get('/list', SubjectController.getSubjects);
router.post('/create', SubjectController.addNewSubject);
router.post('/softDelete', SubjectController.softDeleteSubject);

export default router;
