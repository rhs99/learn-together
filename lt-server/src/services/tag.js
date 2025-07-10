const Tag = require('../models/tag');
const { formatTagName } = require('../common/utils');
const { cacheService } = require('./cache');

const CACHE_KEYS = {
    TAGS_BY_CHAPTER: 'tags:chapter:',
};

const addNewTag = async (body) => {
    body.name = formatTagName(body.name);
    const tag = await Tag.findOne({ name: body.name, chapter: body.chapter }).exec();
    if (tag) {
        return tag;
    }
    let newTag = new Tag(body);
    newTag = await newTag.save();

    await cacheService.del(`${CACHE_KEYS.TAGS_BY_CHAPTER}${body.chapter}`);

    return newTag;
};

const getAllTags = async (chapterId) => {
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
};

module.exports = {
    addNewTag,
    getAllTags,
};
