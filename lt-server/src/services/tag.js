const Tag = require('../models/tag');

const addNewTag = async (body) => {
    try {
        const tag = await Tag.findOne({ name: body.name, chapter: body.chapter }).exec();
        if (tag) {
            return tag;
        }
        const newTag = new Tag(body);
        await newTag.save();
        return newTag;
    } catch (e) {
        console.log(e.message);
    }
};

const getAllTags = async (chapterId) => {
    try {
        const tags = Tag.find({chapter: chapterId, isDeleted: false }).exec();
        return tags;
    } catch (e) {
        console.log(e.message);
    }
};

const softDeleteTag = async (_id) => {
    try {
        const tag = await Tag.findOneAndUpdate(
            { _id },
            { isDeleted: true },
            {
                new: true,
            },
        );
        return tag;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};

module.exports = { addNewTag, getAllTags, softDeleteTag };
