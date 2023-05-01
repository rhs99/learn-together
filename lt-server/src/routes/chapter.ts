import express from 'express';
const router = express.Router();

import ChapterController from '../controllers/chapter';

router.get('/list', ChapterController.getChapters);
router.post('/create', ChapterController.addNewChapter);

export default router;
