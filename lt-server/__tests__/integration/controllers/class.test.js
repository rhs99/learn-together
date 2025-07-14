const mongoose = require('mongoose');
const Class = require('../../../src/models/class');

// Mock middleware for authentication
jest.mock('../../../src/common/middlewares', () => ({
    extractAndVerifyToken: jest.fn((req, res, next) => next()),
    hasAdminPrivilege: jest.fn((req, res, next) => next()),
}));

describe('Class Controller Integration Tests', () => {
    beforeEach(async () => {
        await Class.deleteMany({});
        jest.clearAllMocks();
    });

    describe('GET /classes', () => {
        it('should return all classes', async () => {
            // Create test classes
            await Class.create([{ name: 'Grade 10' }, { name: 'Grade 11' }, { name: 'Grade 12' }]);

            const response = await global.testRequest.get('/classes');

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(3);
            expect(response.body.some((c) => c.name === 'Grade 10')).toBe(true);
            expect(response.body.some((c) => c.name === 'Grade 11')).toBe(true);
            expect(response.body.some((c) => c.name === 'Grade 12')).toBe(true);
        });
    });

    describe('GET /classes/:_id', () => {
        it('should return a specific class by id', async () => {
            const testClass = await Class.create({ name: 'Grade 10' });

            const response = await global.testRequest.get(`/classes/${testClass._id}`);

            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('Grade 10');
        });

        it('should return 400 for invalid id format', async () => {
            const response = await global.testRequest.get('/classes/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 404 for non-existent id', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();

            const response = await global.testRequest.get(`/classes/${nonExistentId}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBeDefined();
        });
    });

    describe('POST /classes', () => {
        it('should create a new class', async () => {
            const classData = { name: 'Grade 10' };

            const response = await global.testRequest.post('/classes').send(classData);

            expect(response.status).toBe(201);

            // Verify class was created in database
            const createdClass = await Class.findOne({ name: 'Grade 10' }).exec();
            expect(createdClass).toBeTruthy();
            expect(createdClass.name).toBe('Grade 10');
        });

        it('should return 400 for missing name', async () => {
            const response = await global.testRequest.post('/classes').send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should validate subject ids', async () => {
            const invalidSubjectId = 'not-an-id';
            const classData = {
                name: 'Grade 10',
                subjects: [invalidSubjectId],
            };

            const response = await global.testRequest.post('/classes').send(classData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should accept valid subject ids', async () => {
            const validSubjectId = new mongoose.Types.ObjectId().toString();
            const classData = {
                name: 'Grade 10',
                subjects: [validSubjectId],
            };

            const response = await global.testRequest.post('/classes').send(classData);

            expect(response.status).toBe(201);

            // Verify class was created with subject
            const createdClass = await Class.findOne({ name: 'Grade 10' }).exec();
            expect(createdClass).toBeTruthy();
            expect(createdClass.subjects.length).toBe(1);
            expect(createdClass.subjects[0].toString()).toBe(validSubjectId);
        });
    });
});
