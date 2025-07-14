const ChapterService = require('../services/chapter');

const getChapterBreadcrumb = async (req, res) => {
    try {
        const chapterBreadcrumb = await ChapterService.getChapterBreadcrumb(req.params._id);
        res.status(200).json(chapterBreadcrumb);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getChapters = async (req, res) => {
    try {
        const chapters = await ChapterService.getChapters(req.query.subjectId);
        res.status(200).json(chapters);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addNewChapter = async (req, res) => {
    try {
        const chapter = await ChapterService.addNewChapter(req.body);
        res.status(201).json(chapter);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { getChapters, addNewChapter, getChapterBreadcrumb };
