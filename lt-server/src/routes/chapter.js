const express = require('express');
const router = express.Router();

const { extractAndVerifyToken, hasAdminPrivilege } = require('../common/middlewares');
const { validate } = require('../common/validation');
const { getChapterBreadcrumbSchema, getChaptersSchema, createChapterSchema } = require('../validations/chapter');

const ChapterController = require('../controllers/chapter');

router.get('/', validate(getChaptersSchema), ChapterController.getChapters);
router.get('/:_id/breadcrumb', validate(getChapterBreadcrumbSchema), ChapterController.getChapterBreadcrumb);
router.post(
    '/',
    extractAndVerifyToken,
    hasAdminPrivilege,
    validate(createChapterSchema),
    ChapterController.addNewChapter,
);

module.exports = router;
