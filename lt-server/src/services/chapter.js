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

const softDeleteChapter = async (body) => {
    try {
        const subjects = await Chapter.findOneAndUpdate(
            { name: body.name, subject: body.subject },
            { isDeleted: true },
        );
        return subjects;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};

module.exports = { getChapters, addNewChapter, softDeleteChapter };
