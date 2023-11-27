const TagService = require('../services/tag');

const getAllTags = async (req, res) => {
    try {
        const tags = await TagService.getAllTags(req.query.chapterId);
        res.status(200).json(tags);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addNewTag = async (req, res) => {
    try {
        const tag = await TagService.addNewTag(req.body);
        res.status(201).json(tag);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports = { getAllTags, addNewTag };
