const Chapter = require('../models/chapter');
const Subject = require('../models/subject');

const getChapters = async (subjectId) => {
    try {
        const chapters = await Chapter.find({ subject: subjectId });
        return chapters;
    } catch (e) {
        console.log(e.message);
    }
};

const addNewChapter = async (body) => {
    try {
        let chapter = new Chapter(body);
        chapter = await chapter.save();
        const sub = await Subject.findById(body.subject).exec();
        sub.chapters.push(chapter._id);
        await sub.save();
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = { getChapters, addNewChapter };
