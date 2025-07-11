const mongoose = require('mongoose');
const SubjectService = require('../../../src/services/subject');

// Mock middleware for authentication
jest.mock('../../../src/common/middlewares', () => ({
    extractAndVerifyToken: jest.fn((req, res, next) => next()),
    hasAdminPrivilege: jest.fn((req, res, next) => next()),
}));

describe('Subject Controller Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /subjects', () => {
        it('should return subjects for a given class', async () => {
            const classId = new mongoose.Types.ObjectId().toString();
            const mockSubjects = [
                { _id: 'id1', name: 'Mathematics', class: classId },
                { _id: 'id2', name: 'Physics', class: classId },
            ];

            jest.spyOn(SubjectService, 'getSubjects').mockResolvedValue(mockSubjects);

            const response = await global.testRequest.get('/subjects').query({ classId });

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body).toEqual(mockSubjects);
            expect(SubjectService.getSubjects).toHaveBeenCalledWith(classId);
        });

        it('should return 400 for missing class ID', async () => {
            const response = await global.testRequest.get('/subjects');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 400 for invalid class ID format', async () => {
            const response = await global.testRequest.get('/subjects').query({ classId: 'invalid-id' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 400 when service throws error', async () => {
            const classId = new mongoose.Types.ObjectId().toString();

            jest.spyOn(SubjectService, 'getSubjects').mockRejectedValue(new Error('Failed to get subjects'));

            const response = await global.testRequest.get('/subjects').query({ classId });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Failed to get subjects');
        });
    });

    describe('GET /subjects/:_id/breadcrumb', () => {
        it('should return breadcrumb for a subject', async () => {
            const subjectId = new mongoose.Types.ObjectId().toString();
            const mockBreadcrumb = [
                { name: 'Grade 10', url: '/classes/class-id' },
                { name: 'Mathematics', url: '#' },
            ];

            jest.spyOn(SubjectService, 'getSubjectBreadcrumb').mockResolvedValue(mockBreadcrumb);

            const response = await global.testRequest.get(`/subjects/${subjectId}/breadcrumb`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBreadcrumb);
            expect(SubjectService.getSubjectBreadcrumb).toHaveBeenCalledWith(subjectId);
        });

        it('should return 400 for invalid subject ID format', async () => {
            const response = await global.testRequest.get('/subjects/invalid-id/breadcrumb');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 400 when service throws error', async () => {
            const subjectId = new mongoose.Types.ObjectId().toString();

            jest.spyOn(SubjectService, 'getSubjectBreadcrumb').mockRejectedValue(new Error('Failed to get breadcrumb'));

            const response = await global.testRequest.get(`/subjects/${subjectId}/breadcrumb`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Failed to get breadcrumb');
        });
    });

    describe('POST /subjects', () => {
        it('should create a new subject', async () => {
            const classId = new mongoose.Types.ObjectId().toString();
            const subjectData = {
                name: 'New Subject',
                class: classId,
            };

            jest.spyOn(SubjectService, 'addNewSubject').mockResolvedValue();

            const response = await global.testRequest.post('/subjects').send(subjectData);

            expect(response.status).toBe(201);
            expect(SubjectService.addNewSubject).toHaveBeenCalledWith(subjectData);
        });

        it('should return 400 for missing name', async () => {
            const classId = new mongoose.Types.ObjectId().toString();
            const subjectData = {
                class: classId,
            };

            const response = await global.testRequest.post('/subjects').send(subjectData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 400 for missing class', async () => {
            const subjectData = {
                name: 'New Subject',
            };

            const response = await global.testRequest.post('/subjects').send(subjectData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 400 for invalid class ID format', async () => {
            const subjectData = {
                name: 'New Subject',
                class: 'invalid-id',
            };

            const response = await global.testRequest.post('/subjects').send(subjectData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 400 when service throws error', async () => {
            const classId = new mongoose.Types.ObjectId().toString();
            const subjectData = {
                name: 'New Subject',
                class: classId,
            };

            jest.spyOn(SubjectService, 'addNewSubject').mockRejectedValue(new Error('Failed to add subject'));

            const response = await global.testRequest.post('/subjects').send(subjectData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Failed to add subject');
        });
    });
});
