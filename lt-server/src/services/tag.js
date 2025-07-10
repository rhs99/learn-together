const Tag = require('../models/tag');
const { formatTagName } = require('../common/utils');

const addNewTag = async (body) => {
    body.name = formatTagName(body.name);
    const tag = await Tag.findOne({ name: body.name, chapter: body.chapter }).exec();
    if (tag) {
        return tag;
    }
    let newTag = new Tag(body);
    newTag = await newTag.save();

    return newTag;
};

const getAllTags = async (chapterId) => {
    const tags = await Tag.find({ chapter: chapterId }).exec();
    return tags;
};

module.exports = { addNewTag, getAllTags };
