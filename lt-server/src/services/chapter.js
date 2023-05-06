const Chapter = require('../models/chapter');

const getChapters = async () => {
    try {
        const chapters = await Chapter.find({ isDeleted: false });
        return chapters;
    } catch (e) {
        console.log(e.message);
    }
};

const addNewChapter = async (body) => {
    try {
        const newChapter = new Chapter(body);
        await newChapter.save();
    } catch (e) {
        console.log(e.message);
    }
};

const softDeleteChapter = async (_id) => {
    try {
        const chapter = await Chapter.findOneAndUpdate(
            { _id },
            { isDeleted: true },
            {
                new: true,
            },
        );
        return chapter;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};

module.exports = { getChapters, addNewChapter, softDeleteChapter };
