const ChapterService = require('../services/chapter');

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
        await ChapterService.addNewChapter(req.body);
        res.status(201).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const softDeleteChapter = async (req, res) => {
    try {
        const chapter = await ChapterService.softDeleteChapter(req.params._id);
        res.status(200).json(chapter);
    } catch (e) {
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

module.exports = { getChapters, addNewChapter, softDeleteChapter };
