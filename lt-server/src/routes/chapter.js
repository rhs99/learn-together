const express = require('express');
const router = express.Router();

const ChapterController = require('../controllers/chapter');

router.get('/list', ChapterController.getChapters);
router.post('/create', ChapterController.addNewChapter);
router.post('/softDelete', ChapterController.softDeleteChapter);

module.exports = router;
