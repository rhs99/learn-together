const TagService = require('../services/tag');
const handleError = require('../common/handleError');

const getAllTags = async (req, res) => {
    try {
        const tags = await TagService.getAllTags(req.query.chapterId);
        res.status(200).json(tags);
    } catch (error) {
        handleError(res, error, 'An error occurred while fetching tags');
    }
};

const addNewTag = async (req, res) => {
    try {
        const tag = await TagService.addNewTag(req.body);
        res.status(201).json(tag);
    } catch (error) {
        handleError(res, error, 'An error occurred while creating the tag');
    }
};

module.exports = { getAllTags, addNewTag };
