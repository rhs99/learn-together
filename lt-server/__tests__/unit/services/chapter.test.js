const mongoose = require('mongoose');
const Chapter = require('../../../src/models/chapter');
const Subject = require('../../../src/models/subject');
const Class = require('../../../src/models/class');
const { cacheService } = require('../../../src/services/cache');
const ChapterService = require('../../../src/services/chapter');

describe('Chapter Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getChapter', () => {
        it('should return a chapter from cache if available', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();
            const cachedChapter = {
                _id: chapterId,
                name: 'Introduction to Algebra',
                subject: new mongoose.Types.ObjectId(),
                questions: [],
            };

            cacheService.get.mockResolvedValue(cachedChapter);

            const result = await ChapterService.getChapter(chapterId);

            expect(cacheService.get).toHaveBeenCalledWith(`chapter:${chapterId}`);
            expect(result).toBeInstanceOf(Chapter);
            expect(result._id.toString()).toBe(chapterId);
            expect(result.name).toBe('Introduction to Algebra');
        });

        it('should fetch chapter from database if not in cache', async () => {
            const chapterId = new mongoose.Types.ObjectId();
            const subjectId = new mongoose.Types.ObjectId();
            const dbChapter = {
                _id: chapterId,
                name: 'Linear Equations',
                subject: {
                    _id: subjectId,
                    name: 'Mathematics',
                },
                questions: [],
                toObject: jest.fn().mockReturnValue({
                    _id: chapterId,
                    name: 'Linear Equations',
                    subject: subjectId,
                    questions: [],
                }),
            };

            cacheService.get.mockResolvedValue(null);
            jest.spyOn(Chapter, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(dbChapter),
            }));

            const result = await ChapterService.getChapter(chapterId);

            expect(cacheService.get).toHaveBeenCalledWith(`chapter:${chapterId}`);
            expect(Chapter.findById).toHaveBeenCalledWith(chapterId);
            expect(cacheService.set).toHaveBeenCalledWith(`chapter:${chapterId}`, dbChapter.toObject(), 1800);
            expect(result).toBe(dbChapter);
        });

        it('should throw NotFoundError if chapter is not found in database', async () => {
            const chapterId = new mongoose.Types.ObjectId();

            cacheService.get.mockResolvedValue(null);
            jest.spyOn(Chapter, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            }));

            await expect(ChapterService.getChapter(chapterId)).rejects.toThrow('Chapter not found');
        });
    });

    describe('getChapterBreadcrumb', () => {
        it('should return breadcrumb from cache if available', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();
            const cachedBreadcrumb = [
                { name: 'Grade 10', url: '/classes/classId' },
                { name: 'Mathematics', url: '/subjects/subjectId' },
                { name: 'Algebra', url: '#' },
            ];

            cacheService.get.mockResolvedValue(cachedBreadcrumb);

            const result = await ChapterService.getChapterBreadcrumb(chapterId);

            expect(cacheService.get).toHaveBeenCalledWith(`chapter:breadcrumb:${chapterId}`);
            expect(result).toEqual(cachedBreadcrumb);
        });

        it('should build breadcrumb from chapter data if not in cache', async () => {
            const chapterId = new mongoose.Types.ObjectId();
            const subjectId = new mongoose.Types.ObjectId();
            const classId = new mongoose.Types.ObjectId();

            const mockChapter = {
                _id: chapterId,
                name: 'Quadratic Equations',
                subject: {
                    _id: subjectId,
                    name: 'Mathematics',
                    class: classId,
                },
                questions: [],
                toObject: jest.fn().mockReturnValue({
                    _id: chapterId,
                    name: 'Quadratic Equations',
                    subject: subjectId,
                    questions: [],
                }),
            };

            const mockClass = {
                _id: classId,
                name: 'Grade 11',
                toObject: jest.fn().mockReturnValue({
                    _id: classId,
                    name: 'Grade 11',
                }),
            };

            const expectedBreadcrumb = [
                { name: 'Grade 11', url: `/classes/${classId}` },
                { name: 'Mathematics', url: `/subjects/${subjectId}` },
                { name: 'Quadratic Equations', url: '#' },
            ];

            // Mock getChapter (will use cache miss, then database)
            cacheService.get.mockResolvedValueOnce(null); // breadcrumb cache miss
            cacheService.get.mockResolvedValueOnce(null); // chapter cache miss
            cacheService.get.mockResolvedValueOnce(null); // class cache miss

            jest.spyOn(Chapter, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockChapter),
            }));

            // Mock Class findById for the getClass call
            jest.spyOn(Class, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(mockClass),
            }));

            const result = await ChapterService.getChapterBreadcrumb(chapterId);

            expect(cacheService.set).toHaveBeenCalledWith(`chapter:breadcrumb:${chapterId}`, expectedBreadcrumb, 3600);
            expect(result).toEqual(expectedBreadcrumb);
        });
    });

    describe('getChapters', () => {
        it('should return chapters from cache if available', async () => {
            const subjectId = new mongoose.Types.ObjectId();
            const cachedChapters = [
                { _id: new mongoose.Types.ObjectId(), name: 'Chapter 1', questionsCount: 5 },
                { _id: new mongoose.Types.ObjectId(), name: 'Chapter 2', questionsCount: 3 },
            ];

            cacheService.get.mockResolvedValue(cachedChapters);

            const result = await ChapterService.getChapters(subjectId);

            expect(cacheService.get).toHaveBeenCalledWith(`chapters:subject:${subjectId}`);
            expect(result).toEqual(cachedChapters);
        });

        it('should fetch chapters from database if not in cache', async () => {
            const subjectId = new mongoose.Types.ObjectId();
            const dbChapters = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    name: 'Introduction',
                    questions: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    name: 'Advanced Topics',
                    questions: [new mongoose.Types.ObjectId()],
                },
            ];

            const expectedResult = [
                { _id: dbChapters[0]._id, name: 'Introduction', questionsCount: 2 },
                { _id: dbChapters[1]._id, name: 'Advanced Topics', questionsCount: 1 },
            ];

            cacheService.get.mockResolvedValue(null);
            jest.spyOn(Chapter, 'find').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(dbChapters),
            }));

            const result = await ChapterService.getChapters(subjectId);

            expect(cacheService.get).toHaveBeenCalledWith(`chapters:subject:${subjectId}`);
            expect(Chapter.find).toHaveBeenCalledWith({ subject: subjectId });
            expect(cacheService.set).toHaveBeenCalledWith(`chapters:subject:${subjectId}`, expectedResult, 900);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('addNewChapter', () => {
        it('should create a new chapter and update the subject', async () => {
            const subjectId = new mongoose.Types.ObjectId();
            const chapterBody = {
                name: 'Probability',
                subject: subjectId,
            };

            const savedChapter = {
                _id: new mongoose.Types.ObjectId(),
                name: 'Probability',
                subject: subjectId,
                questions: [],
            };

            const mockSubject = {
                _id: subjectId,
                name: 'Statistics',
                chapters: [],
                save: jest.fn().mockResolvedValue(true),
                toObject: jest.fn().mockReturnValue({
                    _id: subjectId,
                    name: 'Statistics',
                    chapters: [],
                }),
            };

            // Mock Subject model's findById for the subject service
            jest.spyOn(Subject, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockSubject),
            }));

            jest.spyOn(Chapter.prototype, 'save').mockResolvedValue(savedChapter);

            const result = await ChapterService.addNewChapter(chapterBody);

            expect(result).toEqual(savedChapter);
            expect(mockSubject.chapters).toContain(savedChapter._id);
            expect(mockSubject.save).toHaveBeenCalled();
            expect(cacheService.del).toHaveBeenCalledWith(`chapters:subject:${subjectId}`);
            expect(cacheService.del).toHaveBeenCalledWith(`chapter:${savedChapter._id}`);
        });

        it('should handle errors when creating a new chapter', async () => {
            const subjectId = new mongoose.Types.ObjectId();
            const chapterBody = {
                name: 'Statistics',
                subject: subjectId,
            };

            const error = new Error('Database error');
            jest.spyOn(Chapter.prototype, 'save').mockRejectedValue(error);

            await expect(ChapterService.addNewChapter(chapterBody)).rejects.toThrow('Database error');
        });

        it('should throw NotFoundError if referenced subject does not exist', async () => {
            const subjectId = new mongoose.Types.ObjectId();
            const chapterBody = {
                name: 'Geometry',
                subject: subjectId,
            };

            const savedChapter = {
                _id: new mongoose.Types.ObjectId(),
                name: 'Geometry',
                subject: subjectId,
                questions: [],
            };

            // Mock Subject model's findById to return null (subject not found)
            jest.spyOn(Subject, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            }));

            jest.spyOn(Chapter.prototype, 'save').mockResolvedValue(savedChapter);

            await expect(ChapterService.addNewChapter(chapterBody)).rejects.toThrow(
                'Referenced subject does not exist',
            );
        });
    });

    describe('cache invalidation', () => {
        it('should properly invalidate cache when adding new chapter', async () => {
            const subjectId = new mongoose.Types.ObjectId();
            const chapterBody = {
                name: 'Trigonometry',
                subject: subjectId,
            };

            const savedChapter = {
                _id: new mongoose.Types.ObjectId(),
                name: 'Trigonometry',
                subject: subjectId,
                questions: [],
            };

            const mockSubject = {
                _id: subjectId,
                name: 'Mathematics',
                chapters: [],
                save: jest.fn().mockResolvedValue(this),
                toObject: jest.fn().mockReturnValue({
                    _id: subjectId,
                    name: 'Mathematics',
                    chapters: [],
                }),
            };

            // Mock Subject model's findById to return a valid subject
            jest.spyOn(Subject, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockSubject),
            }));

            jest.spyOn(Chapter.prototype, 'save').mockResolvedValue(savedChapter);

            await ChapterService.addNewChapter(chapterBody);

            expect(cacheService.del).toHaveBeenCalledWith(`chapters:subject:${subjectId}`);
            expect(cacheService.del).toHaveBeenCalledWith(`chapter:${savedChapter._id}`);
            expect(cacheService.del).toHaveBeenCalledTimes(2);
        });
    });
});
