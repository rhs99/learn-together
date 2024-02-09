const Tag = require('../models/tag');
const { clearCache } = require('./cache');
const { formatTagName } = require('../common/utils');

const addNewTag = async (body) => {
    body.name = formatTagName(body.name);
    const tag = await Tag.findOne({ name: body.name, chapter: body.chapter }).exec();
    if (tag) {
        return tag;
    }
    let newTag = new Tag(body);
    newTag = await newTag.save();

    clearCache(`tags-${body.chapter}`);
    return newTag;
};

const getAllTags = async (chapterId) => {
    const tags = Tag.find({ chapter: chapterId }).cache({
        key: `tags-${chapterId}`,
    });
    return tags;
};

module.exports = { addNewTag, getAllTags };
