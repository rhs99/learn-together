const Tag = require('../models/tag');
const { formatTagName } = require('../common/utils');
const { cacheService } = require('./cache');
const { ValidationError, BadRequestError, ConflictError } = require('../common/error');

const CACHE_KEYS = {
    TAGS_BY_CHAPTER: 'tags:chapter:',
};

const addNewTag = async (body) => {
    try {
        body.name = formatTagName(body.name);
        const tag = await Tag.findOne({ name: body.name, chapter: body.chapter }).exec();
        if (tag) {
            return tag;
        }
        let newTag = new Tag(body);
        newTag = await newTag.save();

        await cacheService.del(`${CACHE_KEYS.TAGS_BY_CHAPTER}${body.chapter}`);

        return newTag;
    } catch (error) {
        if (error.code === 11000) {
            throw new ConflictError('Tag with this name already exists in the chapter');
        }
        if (error.name === 'ValidationError') {
            throw new ValidationError('Invalid tag data provided');
        }
        if (error.name === 'CastError') {
            throw new BadRequestError('Invalid chapter ID format');
        }
        throw error;
    }
};

const getAllTags = async (chapterId) => {
    try {
        if (!chapterId) {
            throw new BadRequestError('Chapter ID is required');
        }

        const cacheKey = `${CACHE_KEYS.TAGS_BY_CHAPTER}${chapterId}`;
        const cachedTags = await cacheService.get(cacheKey);

        if (cachedTags) {
            return cachedTags.map((tagData) => new Tag(tagData));
        }

        const tags = await Tag.find({ chapter: chapterId }).exec();

        await cacheService.set(
            cacheKey,
            tags.map((t) => t.toObject()),
            900,
        );

        return tags;
    } catch (error) {
        if (error.name === 'CastError') {
            throw new BadRequestError('Invalid chapter ID format');
        }
        throw error;
    }
};

module.exports = {
    addNewTag,
    getAllTags,
};
