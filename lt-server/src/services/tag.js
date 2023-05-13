const Tag = require('../models/tag');

const addNewTag = async (body) => {
    try {
        const newTag = new Tag(body);
        await newTag.save();
    } catch (e) {
        console.log(e.message);
    }
};

const getAllTags = async () => {
    try {
        const tags = Tag.find({ isDeleted: false }).exec();
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
