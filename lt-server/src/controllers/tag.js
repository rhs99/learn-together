const TagService = require('../services/tag');

const getAllTags = async (req, res) => {
    try {
        const tags = await TagService.getAllTags();
        res.status(200).json(tags);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addNewTag = async (req, res) => {
    try {
        await TagService.addNewTag(req.body);
        res.status(201).json();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const softDeleteTag = async (req, res) => {
    try {
        const tag = await TagService.softDeleteTag(req.params._id);
        res.status(200).json(tag);
    } catch (e) {
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

module.exports = { getAllTags, addNewTag, softDeleteTag };
