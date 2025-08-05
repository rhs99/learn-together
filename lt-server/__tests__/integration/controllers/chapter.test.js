const mongoose = require('mongoose');
const ChapterService = require('../../../src/services/chapter');

describe('Chapter Controller Integration Tests', () => {
    describe('GET /chapters', () => {
        it('should return chapters for a given subject', async () => {
            const subjectId = new mongoose.Types.ObjectId().toString();
            const mockChapters = [
                { _id: 'id1', name: 'Chapter 1', questionsCount: 5 },
                { _id: 'id2', name: 'Chapter 2', questionsCount: 3 },
            ];

            jest.spyOn(ChapterService, 'getChapters').mockResolvedValue(mockChapters);

            const response = await global.testRequest.get('/chapters').query({ subjectId });

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body).toEqual(mockChapters);
            expect(ChapterService.getChapters).toHaveBeenCalledWith(subjectId);
        });

        it('should return 400 for missing subject ID', async () => {
            const response = await global.testRequest.get('/chapters');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 400 for invalid subject ID format', async () => {
            const response = await global.testRequest.get('/chapters').query({ subjectId: 'invalid-id' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 500 when service throws error', async () => {
            const subjectId = new mongoose.Types.ObjectId().toString();

            jest.spyOn(ChapterService, 'getChapters').mockRejectedValue(new Error('Failed to get chapters'));

            const response = await global.testRequest.get('/chapters').query({ subjectId });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal Server Error');
        });
    });

    describe('GET /chapters/:_id/breadcrumb', () => {
        it('should return breadcrumb for a chapter', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();
            const mockBreadcrumb = [
                { name: 'Grade 10', url: '/classes/class-id' },
                { name: 'Mathematics', url: '/subjects/subject-id' },
                { name: 'Algebra', url: '#' },
            ];

            jest.spyOn(ChapterService, 'getChapterBreadcrumb').mockResolvedValue(mockBreadcrumb);

            const response = await global.testRequest.get(`/chapters/${chapterId}/breadcrumb`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBreadcrumb);
            expect(ChapterService.getChapterBreadcrumb).toHaveBeenCalledWith(chapterId);
        });

        it('should return 400 for invalid chapter ID format', async () => {
            const response = await global.testRequest.get('/chapters/invalid-id/breadcrumb');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });
    });

    describe('POST /chapters', () => {
        it('should create a new chapter', async () => {
            const subjectId = new mongoose.Types.ObjectId().toString();
            const chapterData = {
                name: 'New Chapter',
                subject: subjectId,
            };

            jest.spyOn(ChapterService, 'addNewChapter').mockResolvedValue();

            const response = await global.testRequest.post('/chapters').send(chapterData);

            expect(response.status).toBe(201);
            expect(ChapterService.addNewChapter).toHaveBeenCalledWith(chapterData);
        });

        it('should return 400 for missing name', async () => {
            const subjectId = new mongoose.Types.ObjectId().toString();
            const chapterData = {
                subject: subjectId,
            };

            const response = await global.testRequest.post('/chapters').send(chapterData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 400 for missing subject', async () => {
            const chapterData = {
                name: 'New Chapter',
            };

            const response = await global.testRequest.post('/chapters').send(chapterData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 400 for invalid subject ID format', async () => {
            const chapterData = {
                name: 'New Chapter',
                subject: 'invalid-id',
            };

            const response = await global.testRequest.post('/chapters').send(chapterData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });
    });
});
