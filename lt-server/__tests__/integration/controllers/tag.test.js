const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Tag = require('../../../src/models/tag');
const TagController = require('../../../src/controllers/tag');
const TagService = require('../../../src/services/tag');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/tags', TagController.getAllTags);
app.post('/api/tags', TagController.addNewTag);

describe('Tag Controller Integration Tests', () => {
    const chapterId = new mongoose.Types.ObjectId().toString();

    beforeEach(async () => {
        await Tag.deleteMany({});

        jest.restoreAllMocks();
    });

    describe('GET /api/tags', () => {
        it('should return all tags for a given chapter', async () => {
            await Tag.create([
                { name: 'Javascript', chapter: chapterId },
                { name: 'React', chapter: chapterId },
                { name: 'Node', chapter: chapterId },
            ]);

            const response = await request(app).get('/api/tags').query({ chapterId });

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(3);

            const tagNames = response.body.map((tag) => tag.name);
            expect(tagNames).toContain('Javascript');
            expect(tagNames).toContain('React');
            expect(tagNames).toContain('Node');
        });

        it('should return empty array when no tags found', async () => {
            const response = await request(app)
                .get('/api/tags')
                .query({ chapterId: new mongoose.Types.ObjectId().toString() });

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(0);
        });

        it('should handle errors properly', async () => {
            jest.spyOn(TagService, 'getAllTags').mockImplementation(() => {
                throw new Error('Test error');
            });

            const response = await request(app).get('/api/tags').query({ chapterId });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Test error');
        });
    });

    describe('POST /api/tags', () => {
        it('should create a new tag successfully', async () => {
            const tagData = {
                name: 'javascript',
                chapter: chapterId,
            };

            const response = await request(app).post('/api/tags').send(tagData);

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

            const response = await request(app).post('/api/tags').send({ name: 'javascript', chapter: chapterId });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id', existingTag._id.toString());

            const count = await Tag.countDocuments({ name: 'Javascript', chapter: chapterId });
            expect(count).toBe(1);
        });

        it('should handle validation errors', async () => {
            const response = await request(app).post('/api/tags').send({ name: 'javascript' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
        });
    });
});
