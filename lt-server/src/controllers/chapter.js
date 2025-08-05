const ChapterService = require('../services/chapter');
const logger = require('../config/logger');

const getChapterBreadcrumb = async (req, res) => {
    logger.debug('Fetching chapter breadcrumb', { chapterId: req.params._id });
    const chapterBreadcrumb = await ChapterService.getChapterBreadcrumb(req.params._id);
    res.status(200).json(chapterBreadcrumb);
};

const getChapters = async (req, res) => {
    logger.debug('Fetching chapters', { subjectId: req.query.subjectId });
    const chapters = await ChapterService.getChapters(req.query.subjectId);
    logger.debug('Chapters fetched successfully', {
        subjectId: req.query.subjectId,
        chapterCount: chapters.length,
    });
    res.status(200).json(chapters);
};

const addNewChapter = async (req, res) => {
    logger.business('New chapter creation', {
        chapterName: req.body.name,
        subjectId: req.body.subjectId,
    });
    const chapter = await ChapterService.addNewChapter(req.body);
    logger.info('Chapter created successfully', {
        chapterId: chapter._id,
        chapterName: chapter.name,
    });
    res.status(201).json(chapter);
};

module.exports = { getChapters, addNewChapter, getChapterBreadcrumb };
