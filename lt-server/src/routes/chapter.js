const express = require('express');
const router = express.Router();

const ChapterController = require('../controllers/chapter');

router.get('/:id/breadcrumb', ChapterController.getChapterBreadcrumb);
router.get('/list', ChapterController.getChapters);
router.post('/create', ChapterController.addNewChapter);

module.exports = router;
