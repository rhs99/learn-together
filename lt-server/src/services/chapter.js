const Chapter = require('../models/chapter');

const { getClass } = require('./class');
const { getSubject } = require('./subject');
const { clearCache } = require('./cache');

const getChapter = async (id) => {
    const chapter = await Chapter.findById(id).cache({
        key: `chapters-${id}`,
    });
    return chapter;
};

const getChapterBreadcrumb = async (id) => {
    const chapter = await getChapter(id);
    const subject = await getSubject(chapter.subject);
    const _class = await getClass(subject.class);

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
        key: `chapters-${subjectId}`,
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
    const sub = await getSubject(body.subject);
    sub.chapters.push(chapter._id);
    await sub.save();
    clearCache(`chapters-${body.subject}`);
};

module.exports = { getChapter, getChapters, addNewChapter, getChapterBreadcrumb };
