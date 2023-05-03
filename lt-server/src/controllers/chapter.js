const ChapterService = require('../services/chapter');

const getChapters = async (req, res) => {
    try {
        const chapters = await ChapterService.getChapters();
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
        const chapters = await ChapterService.softDeleteChapter(req.body);
        res.status(200).json(chapters);
    } catch (e) {
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export default { getChapters, addNewChapter, softDeleteChapter };
