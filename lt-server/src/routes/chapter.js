const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');

const ChapterController = require('../controllers/chapter');

router.get('/', ChapterController.getChapters);
router.get('/:_id/breadcrumb', ChapterController.getChapterBreadcrumb);
router.post('/', extractAndVerifyToken, hasAdminPrivilege, ChapterController.addNewChapter);

module.exports = router;
