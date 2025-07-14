const ChapterService = require('../services/chapter');
const handleError = require('../common/handleError');

const getChapterBreadcrumb = async (req, res) => {
    try {
        const chapterBreadcrumb = await ChapterService.getChapterBreadcrumb(req.params._id);
        res.status(200).json(chapterBreadcrumb);
    } catch (error) {
        handleError(res, error, 'An error occurred while fetching chapter breadcrumb');
    }
};

const getChapters = async (req, res) => {
    try {
        const chapters = await ChapterService.getChapters(req.query.subjectId);
        res.status(200).json(chapters);
    } catch (error) {
        handleError(res, error, 'An error occurred while fetching chapters');
    }
};

const addNewChapter = async (req, res) => {
    try {
        const chapter = await ChapterService.addNewChapter(req.body);
        res.status(201).json(chapter);
    } catch (error) {
        handleError(res, error, 'An error occurred while creating the chapter');
    }
};

module.exports = { getChapters, addNewChapter, getChapterBreadcrumb };
