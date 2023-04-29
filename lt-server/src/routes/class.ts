import express from 'express';
const router = express.Router();

import ClassController from '../controllers/class';

router.get('/list', ClassController.getClasses);
router.post('/create', ClassController.addNewClass);

export default router;
