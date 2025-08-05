const Tag = require('../models/tag');
const { formatTagName } = require('../common/utils');
const { cacheService } = require('./cache');
const { ValidationError, BadRequestError, ConflictError } = require('../common/error');
const logger = require('../config/logger');

const CACHE_KEYS = {
    TAGS_BY_CHAPTER: 'tags:chapter:',
};

const addNewTag = async (body) => {
    try {
        body.name = formatTagName(body.name);
        logger.database('Checking for existing tag', 'tags', {
            tagName: body.name,
            chapterId: body.chapter,
        });

        const tag = await Tag.findOne({ name: body.name, chapter: body.chapter }).exec();
        if (tag) {
            logger.debug('Tag already exists, returning existing', {
                tagId: tag._id,
                tagName: tag.name,
            });
            return tag;
        }

        logger.database('Creating new tag', 'tags', {
            tagName: body.name,
            chapterId: body.chapter,
        });
        let newTag = new Tag(body);
        newTag = await newTag.save();

        logger.debug('Invalidating tag cache for chapter', { chapterId: body.chapter });
        await cacheService.del(`${CACHE_KEYS.TAGS_BY_CHAPTER}${body.chapter}`);

        logger.database('Tag created successfully', 'tags', {
            tagId: newTag._id,
            tagName: newTag.name,
        });
        return newTag;
    } catch (error) {
        if (error.code === 11000) {
            logger.warn('Tag creation failed - duplicate name', {
                tagName: body.name,
                chapterId: body.chapter,
            });
            throw new ConflictError('Tag with this name already exists in the chapter');
        }
        if (error.name === 'ValidationError') {
            logger.warn('Tag creation failed - validation error', {
                error: error.message,
                tagData: body,
            });
            throw new ValidationError('Invalid tag data provided');
        }
        if (error.name === 'CastError') {
            logger.warn('Tag creation failed - invalid chapter ID', { chapterId: body.chapter });
            throw new BadRequestError('Invalid chapter ID format');
        }
        logger.error('Tag creation failed', { error: error.message, tagData: body });
        throw error;
    }
};

const getAllTags = async (chapterId) => {
    try {
        const cacheKey = `${CACHE_KEYS.TAGS_BY_CHAPTER}${chapterId}`;
        logger.debug('Fetching tags for chapter', { chapterId, cacheKey });

        const cachedTags = await cacheService.get(cacheKey);

        if (cachedTags) {
            logger.debug('Tags found in cache', { chapterId, count: cachedTags.length });
            return cachedTags.map((tagData) => new Tag(tagData));
        }

        logger.database('Querying tags by chapter', 'tags', { chapterId });
        const tags = await Tag.find({ chapter: chapterId }).exec();

        await cacheService.set(
            cacheKey,
            tags.map((t) => t.toObject()),
            900,
        );

        logger.debug('Tags cached successfully', { chapterId, count: tags.length });
        return tags;
    } catch (error) {
        if (error.name === 'CastError') {
            logger.warn('Invalid chapter ID format for tag query', { chapterId });
            throw new BadRequestError('Invalid chapter ID format');
        }
        logger.error('Error fetching tags', { error: error.message, chapterId });
        throw error;
    }
};

module.exports = {
    addNewTag,
    getAllTags,
};
