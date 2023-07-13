const Chapter = require('../models/chapter');
const Subject = require('../models/subject');
const Class = require('../models/class');

const getChapterBreadcrumb = async (id) => {
    try {
        const chapter = await Chapter.findById(id).exec();
        const subject = await Subject.findById(chapter.subject).exec();
        const _class = await Class.findById(subject.class).exec();
        return [
            {
                name: _class.name,
                url: `/classes/${_class._id}`,
            },
            {
                name: subject.name,
                url: `/subjects/${subject._id}`,
            },
            {
                name: chapter.name,
                url: '#',
            },
        ];
    } catch (e) {
        console.log(e.message);
    }
};

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

module.exports = { getChapters, addNewChapter, getChapterBreadcrumb };
