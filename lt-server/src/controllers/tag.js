const TagService = require('../services/tag');

const getAllTags = async (req, res) => {
    const tags = await TagService.getAllTags(req.query.chapterId);
    res.status(200).json(tags);
};

const addNewTag = async (req, res) => {
    const tag = await TagService.addNewTag(req.body);
    res.status(201).json(tag);
};

module.exports = { getAllTags, addNewTag };
