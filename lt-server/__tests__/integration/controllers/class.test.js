const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Class = require('../../../src/models/class');
const ClassController = require('../../../src/controllers/class');
const { validate } = require('../../../src/common/validation');
const { getClassSchema, getClassesSchema, createClassSchema } = require('../../../src/validations/class');
const { extractAndVerifyToken, hasAdminPrivilege } = require('../../../src/common/middlewares');

// Mock middleware for authentication
jest.mock('../../../src/common/middlewares', () => ({
    extractAndVerifyToken: jest.fn((req, res, next) => next()),
    hasAdminPrivilege: jest.fn((req, res, next) => next())
}));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup routes
app.get('/api/classes', validate(getClassesSchema), ClassController.getClasses);
app.get('/api/classes/:_id', validate(getClassSchema), ClassController.getClass);
app.post('/api/classes', extractAndVerifyToken, hasAdminPrivilege, validate(createClassSchema), ClassController.addNewClass);

describe('Class Controller Integration Tests', () => {
    beforeEach(async () => {
        await Class.deleteMany({});
        jest.clearAllMocks();
    });

    describe('GET /api/classes', () => {
        it('should return all classes', async () => {
            // Create test classes
            await Class.create([
                { name: 'Grade 10' },
                { name: 'Grade 11' },
                { name: 'Grade 12' }
            ]);

            const response = await request(app).get('/api/classes');

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(3);
            expect(response.body.some(c => c.name === 'Grade 10')).toBe(true);
            expect(response.body.some(c => c.name === 'Grade 11')).toBe(true);
            expect(response.body.some(c => c.name === 'Grade 12')).toBe(true);
        });
    });

    describe('GET /api/classes/:_id', () => {
        it('should return a specific class by id', async () => {
            const testClass = await Class.create({ name: 'Grade 10' });

            const response = await request(app).get(`/api/classes/${testClass._id}`);

            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('Grade 10');
        });

        it('should return 400 for invalid id format', async () => {
            const response = await request(app).get('/api/classes/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return null for non-existent id with 200 status', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            
            // Mock the service to simulate not finding the class
            jest.spyOn(Class, 'findById').mockImplementationOnce(() => ({
                exec: jest.fn().mockResolvedValue(null)
            }));

            const response = await request(app).get(`/api/classes/${nonExistentId}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeNull();
        });
    });

    describe('POST /api/classes', () => {
        it('should create a new class', async () => {
            const classData = { name: 'Grade 10' };

            const response = await request(app)
                .post('/api/classes')
                .send(classData);

            expect(response.status).toBe(201);
            
            // Verify class was created in database
            const createdClass = await Class.findOne({ name: 'Grade 10' }).exec();
            expect(createdClass).toBeTruthy();
            expect(createdClass.name).toBe('Grade 10');
        });

        it('should return 400 for missing name', async () => {
            const response = await request(app)
                .post('/api/classes')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should validate subject ids', async () => {
            const invalidSubjectId = 'not-an-id';
            const classData = {
                name: 'Grade 10',
                subjects: [invalidSubjectId]
            };

            const response = await request(app)
                .post('/api/classes')
                .send(classData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should accept valid subject ids', async () => {
            const validSubjectId = new mongoose.Types.ObjectId().toString();
            const classData = {
                name: 'Grade 10',
                subjects: [validSubjectId]
            };

            const response = await request(app)
                .post('/api/classes')
                .send(classData);

            expect(response.status).toBe(201);
            
            // Verify class was created with subject
            const createdClass = await Class.findOne({ name: 'Grade 10' }).exec();
            expect(createdClass).toBeTruthy();
            expect(createdClass.subjects.length).toBe(1);
            expect(createdClass.subjects[0].toString()).toBe(validSubjectId);
        });
    });
});
