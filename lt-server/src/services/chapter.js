const Chapter = require('../models/chapter');
const Subject = require('../models/subject');
const Class = require('../models/class');

const { clearCache } = require('./cache');

const getChapterBreadcrumb = async (id) => {
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
};

const getChapters = async (subjectId) => {
    const chapters = await Chapter.find({ subject: subjectId }).cache({
        key: `chapters-${subjectId}`
    });
    const resp = chapters.map((chapter) => ({
        _id: chapter._id,
        name: chapter.name,
        questionsCount: chapter.questions.length,
    }));
    return resp;
};

const addNewChapter = async (body) => {
    let chapter = new Chapter(body);
    chapter = await chapter.save();
    const sub = await Subject.findById(body.subject).exec();
    sub.chapters.push(chapter._id);
    await sub.save();
    clearCache(`chapters-${body.subject}`);
};

module.exports = { getChapters, addNewChapter, getChapterBreadcrumb };
