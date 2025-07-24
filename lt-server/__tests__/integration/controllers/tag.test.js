const mongoose = require('mongoose');
const Tag = require('../../../src/models/tag');
const TagService = require('../../../src/services/tag');

describe('Tag Controller Integration Tests', () => {
    const chapterId = new mongoose.Types.ObjectId().toString();

    beforeEach(async () => {
        await Tag.deleteMany({});

        jest.restoreAllMocks();
    });

    describe('GET /tags', () => {
        it('should return all tags for a given chapter', async () => {
            await Tag.create([
                { name: 'Javascript', chapter: chapterId },
                { name: 'React', chapter: chapterId },
                { name: 'Node', chapter: chapterId },
            ]);

            const response = await global.testRequest.get('/tags').query({ chapterId });

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(3);

            const tagNames = response.body.map((tag) => tag.name);
            expect(tagNames).toContain('Javascript');
            expect(tagNames).toContain('React');
            expect(tagNames).toContain('Node');
        });

        it('should return empty array when no tags found', async () => {
            const response = await global.testRequest
                .get('/tags')
                .query({ chapterId: new mongoose.Types.ObjectId().toString() });

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(0);
        });

        it('should return validation error if chapterId is missing', async () => {
            const response = await global.testRequest.get('/tags');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body.errors).toBeInstanceOf(Array);

            expect(response.body.errors.length).toBeGreaterThan(0);
        });

        it('should return validation error if chapterId is invalid', async () => {
            const response = await global.testRequest.get('/tags').query({ chapterId: 'invalid-id' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body.errors).toBeInstanceOf(Array);

            expect(response.body.errors.length).toBeGreaterThan(0);
        });

        it('should handle errors properly', async () => {
            jest.spyOn(TagService, 'getAllTags').mockImplementation(() => {
                throw new Error('Test error');
            });

            const response = await global.testRequest.get('/tags').query({ chapterId });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Internal Server Error');
        });
    });

    describe('POST /tags', () => {
        it('should create a new tag successfully', async () => {
            const tagData = {
                name: 'javascript',
                chapter: chapterId,
            };

            const response = await global.testRequest.post('/tags').send(tagData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('name', 'Javascript');
            expect(response.body).toHaveProperty('chapter', chapterId);

            const savedTag = await Tag.findById(response.body._id);
            expect(savedTag).toBeTruthy();
            expect(savedTag.name).toBe('Javascript');
        });

        it('should return existing tag when submitting duplicate name', async () => {
            const existingTag = await Tag.create({ name: 'Javascript', chapter: chapterId });

            const response = await global.testRequest.post('/tags').send({ name: 'javascript', chapter: chapterId });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id', existingTag._id.toString());

            const count = await Tag.countDocuments({ name: 'Javascript', chapter: chapterId });
            expect(count).toBe(1);
        });

        it('should return validation error when name is missing', async () => {
            const response = await global.testRequest.post('/tags').send({ chapter: chapterId });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body.errors).toBeInstanceOf(Array);

            expect(response.body.errors.length).toBeGreaterThan(0);
        });

        it('should return validation error when chapter is missing', async () => {
            const response = await global.testRequest.post('/tags').send({ name: 'javascript' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body.errors).toBeInstanceOf(Array);

            expect(response.body.errors.length).toBeGreaterThan(0);
        });

        it('should return validation error when name contains invalid characters', async () => {
            const response = await global.testRequest
                .post('/tags')
                .send({ name: 'javascript#$%^', chapter: chapterId });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body.errors).toBeInstanceOf(Array);
            expect(response.body.errors.length).toBeGreaterThan(0);

            const nameError = response.body.errors.find((err) => err.path === 'name');
            expect(nameError).toBeDefined();
            expect(nameError.message).toBe('Tag name can only contain letters, numbers, spaces, and hyphens');
        });
        it('should return validation error when name is too long', async () => {
            const longName = 'a'.repeat(51);

            const response = await global.testRequest.post('/tags').send({ name: longName, chapter: chapterId });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body.errors).toBeInstanceOf(Array);

            const nameError = response.body.errors.find((err) => err.path === 'name');
            expect(nameError).toBeDefined();
            expect(nameError.message).toBe('Tag name cannot exceed 50 characters');
        });
    });
});
