const TagService = require('../services/tag');
const logger = require('../config/logger');

const getAllTags = async (req, res) => {
    logger.debug('Fetching tags', { chapterId: req.query.chapterId });
    const tags = await TagService.getAllTags(req.query.chapterId);
    logger.debug('Tags fetched successfully', {
        chapterId: req.query.chapterId,
        tagCount: tags.length,
    });
    res.status(200).json(tags);
};

const addNewTag = async (req, res) => {
    logger.business('New tag creation', {
        tagName: req.body.name,
        chapterId: req.body.chapterId,
    });
    const tag = await TagService.addNewTag(req.body);
    logger.info('Tag created successfully', { tagId: tag._id, tagName: tag.name });
    res.status(201).json(tag);
};

module.exports = { getAllTags, addNewTag };
