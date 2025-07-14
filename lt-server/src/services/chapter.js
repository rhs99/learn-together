const Chapter = require('../models/chapter');
const { getClass } = require('./class');
const { getSubject } = require('./subject');
const { cacheService } = require('./cache');

const CACHE_KEYS = {
    CHAPTER: 'chapter',
    CHAPTER_PREFIX: 'chapter:',
    CHAPTERS_BY_SUBJECT: 'chapters:subject:',
    CHAPTER_BREADCRUMB: 'chapter:breadcrumb:',
};

const getChapter = async (id) => {
    try {
        const cacheKey = `${CACHE_KEYS.CHAPTER_PREFIX}${id}`;
        const cachedChapter = await cacheService.get(cacheKey);

        if (cachedChapter) {
            return new Chapter(cachedChapter);
        }
        const chapter = await Chapter.findById(id).populate('subject').exec();
        await cacheService.set(cacheKey, chapter.toObject(), 1800);

        return chapter;
    } catch (error) {
        console.error('Error fetching chapter:', error);
        throw error;
    }
};

const getChapterBreadcrumb = async (id) => {
    try {
        const cacheKey = `${CACHE_KEYS.CHAPTER_BREADCRUMB}${id}`;
        const cachedBreadcrumb = await cacheService.get(cacheKey);

        if (cachedBreadcrumb) {
            return cachedBreadcrumb;
        }

        const chapter = await getChapter(id);
        const subject = chapter.subject;
        const _class = await getClass(subject.class);

        const breadcrumb = [
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

        await cacheService.set(cacheKey, breadcrumb, 3600);

        return breadcrumb;
    } catch (error) {
        console.error('Error generating chapter breadcrumb:', error);
        throw error;
    }
};

const getChapters = async (subjectId) => {
    try {
        const cacheKey = `${CACHE_KEYS.CHAPTERS_BY_SUBJECT}${subjectId}`;
        const cachedChapters = await cacheService.get(cacheKey);

        if (cachedChapters) {
            return cachedChapters;
        }

        const chapters = await Chapter.find({ subject: subjectId }).exec();

        const resp = chapters.map((chapter) => ({
            _id: chapter._id,
            name: chapter.name,
            questionsCount: chapter.questions.length,
        }));

        await cacheService.set(cacheKey, resp, 900);

        return resp;
    } catch (error) {
        console.error('Error fetching chapters:', error);
        throw error;
    }
};

const addNewChapter = async (body) => {
    try {
        let chapter = new Chapter(body);
        chapter = await chapter.save();

        const subject = await getSubject(body.subject);

        subject.chapters.push(chapter._id);
        await subject.save();

        await cacheService.del(`${CACHE_KEYS.CHAPTERS_BY_SUBJECT}${body.subject}`);
        await cacheService.del(`${CACHE_KEYS.CHAPTER_PREFIX}${chapter._id}`);

        return chapter;
    } catch (error) {
        console.error('Error creating new chapter:', error);
        throw error;
    }
};

module.exports = {
    getChapter,
    getChapters,
    addNewChapter,
    getChapterBreadcrumb,
};
