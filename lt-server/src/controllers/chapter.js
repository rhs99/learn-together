const ChapterService = require('../services/chapter');

const getChapterBreadcrumb = async (req, res) => {
    const chapterBreadcrumb = await ChapterService.getChapterBreadcrumb(req.params._id);
    res.status(200).json(chapterBreadcrumb);
};

const getChapters = async (req, res) => {
    const chapters = await ChapterService.getChapters(req.query.subjectId);
    res.status(200).json(chapters);
};

const addNewChapter = async (req, res) => {
    const chapter = await ChapterService.addNewChapter(req.body);
    res.status(201).json(chapter);
};

module.exports = { getChapters, addNewChapter, getChapterBreadcrumb };
