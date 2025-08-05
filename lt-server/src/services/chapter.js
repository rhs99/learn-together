const Chapter = require('../models/chapter');
const { getClass } = require('./class');
const { getSubject } = require('./subject');
const { cacheService } = require('./cache');
const { NotFoundError, BadRequestError } = require('../common/error');
const logger = require('../config/logger');

const CACHE_KEYS = {
    CHAPTER: 'chapter',
    CHAPTER_PREFIX: 'chapter:',
    CHAPTERS_BY_SUBJECT: 'chapters:subject:',
    CHAPTER_BREADCRUMB: 'chapter:breadcrumb:',
};

const getChapter = async (id) => {
    try {
        const cacheKey = `${CACHE_KEYS.CHAPTER_PREFIX}${id}`;
        logger.debug('Fetching chapter', { chapterId: id, cacheKey });

        const cachedChapter = await cacheService.get(cacheKey);

        if (cachedChapter) {
            logger.debug('Chapter found in cache', { chapterId: id });
            return new Chapter(cachedChapter);
        }

        logger.database('Querying chapter by ID', 'chapters', { chapterId: id });
        const chapter = await Chapter.findById(id).populate('subject').exec();

        if (!chapter) {
            logger.warn('Chapter not found', { chapterId: id });
            throw new NotFoundError('Chapter not found');
        }

        await cacheService.set(cacheKey, chapter.toObject(), 1800);
        logger.debug('Chapter cached successfully', { chapterId: id });

        return chapter;
    } catch (error) {
        if (error.name === 'CastError') {
            logger.warn('Invalid chapter ID format', { chapterId: id });
            throw new BadRequestError('Invalid chapter ID format');
        }
        throw error;
    }
};

const getChapterBreadcrumb = async (id) => {
    try {
        const cacheKey = `${CACHE_KEYS.CHAPTER_BREADCRUMB}${id}`;
        logger.debug('Fetching chapter breadcrumb', { chapterId: id, cacheKey });

        const cachedBreadcrumb = await cacheService.get(cacheKey);

        if (cachedBreadcrumb) {
            logger.debug('Chapter breadcrumb found in cache', { chapterId: id });
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
        logger.debug('Chapter breadcrumb cached successfully', { chapterId: id });

        return breadcrumb;
    } catch (error) {
        logger.error('Error building chapter breadcrumb', {
            error: error.message,
            chapterId: id,
        });
        throw error;
    }
};

const getChapters = async (subjectId) => {
    try {
        const cacheKey = `${CACHE_KEYS.CHAPTERS_BY_SUBJECT}${subjectId}`;
        logger.debug('Fetching chapters for subject', { subjectId, cacheKey });

        const cachedChapters = await cacheService.get(cacheKey);

        if (cachedChapters) {
            logger.debug('Chapters found in cache', { subjectId, count: cachedChapters.length });
            return cachedChapters;
        }

        logger.database('Querying chapters by subject', 'chapters', { subjectId });
        const chapters = await Chapter.find({ subject: subjectId }).exec();

        const resp = chapters.map((chapter) => ({
            _id: chapter._id,
            name: chapter.name,
            questionsCount: chapter.questions.length,
        }));

        await cacheService.set(cacheKey, resp, 900);
        logger.debug('Chapters cached successfully', { subjectId, count: resp.length });

        return resp;
    } catch (error) {
        if (error.name === 'CastError') {
            logger.warn('Invalid subject ID format for chapter query', { subjectId });
            throw new BadRequestError('Invalid subject ID format');
        }
        logger.error('Error fetching chapters', { error: error.message, subjectId });
        throw error;
    }
};

const addNewChapter = async (body) => {
    try {
        logger.database('Creating new chapter', 'chapters', {
            chapterName: body.name,
            subjectId: body.subject,
        });
        let chapter = new Chapter(body);
        chapter = await chapter.save();

        logger.database('Adding chapter to subject', 'subjects', {
            chapterId: chapter._id,
            subjectId: body.subject,
        });
        const subject = await getSubject(body.subject);

        subject.chapters.push(chapter._id);
        await subject.save();

        logger.debug('Invalidating chapter caches', { subjectId: body.subject });
        await cacheService.del(`${CACHE_KEYS.CHAPTERS_BY_SUBJECT}${body.subject}`);
        await cacheService.del(`${CACHE_KEYS.CHAPTER_PREFIX}${chapter._id}`);

        logger.database('Chapter created successfully', 'chapters', {
            chapterId: chapter._id,
            chapterName: chapter.name,
        });
        return chapter;
    } catch (error) {
        if (error.message === 'Subject not found') {
            logger.warn('Chapter creation failed - subject not found', { subjectId: body.subject });
            throw new NotFoundError('Referenced subject does not exist');
        }
        logger.error('Chapter creation failed', { error: error.message, chapterData: body });
        throw error;
    }
};

module.exports = {
    getChapter,
    getChapters,
    addNewChapter,
    getChapterBreadcrumb,
};
