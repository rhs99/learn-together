const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const ChapterController = require('../controllers/chapter');

router.get('/:id/breadcrumb', ChapterController.getChapterBreadcrumb);
router.get('/list', ChapterController.getChapters);
router.post('/create', extractAndVerifyToken, hasAdminPrivilege, ChapterController.addNewChapter);

module.exports = router;
