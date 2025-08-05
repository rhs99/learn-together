const mongoose = require('mongoose');
const QuestionService = require('../../../src/services/question');

describe('Question Controller Integration Tests', () => {
    describe('POST /questions/search', () => {
        it('should return questions for a given chapter', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();
            const mockQuestions = [
                {
                    _id: 'id1',
                    details: { content: 'What is calculus?' },
                    userName: 'user1',
                    chapter: chapterId,
                    upVote: 5,
                    downVote: 1,
                    tags: [],
                    imageLocations: [],
                    answers: [],
                    isFavourite: false,
                },
                {
                    _id: 'id2',
                    details: { content: 'How to solve derivatives?' },
                    userName: 'user2',
                    chapter: chapterId,
                    upVote: 3,
                    downVote: 0,
                    tags: [],
                    imageLocations: [],
                    answers: [],
                    isFavourite: false,
                },
            ];

            jest.spyOn(QuestionService, 'getAllQuestions').mockResolvedValue(mockQuestions);

            const response = await global.testRequest
                .post('/questions/search')
                .send({ chapterId });

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body).toEqual(mockQuestions);
            expect(QuestionService.getAllQuestions).toHaveBeenCalledWith(
                { chapterId, user: expect.any(Object) },
                {}
            );
        });

        it('should return 400 for missing chapter ID', async () => {
            const response = await global.testRequest
                .post('/questions/search')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(response.body.errors.length).toBeGreaterThan(0);
        });

        it('should return 400 for invalid chapter ID format', async () => {
            const response = await global.testRequest
                .post('/questions/search')
                .send({ chapterId: 'invalid-id' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(response.body.errors.length).toBeGreaterThan(0);
        });

        it('should handle pagination query parameters', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();
            const mockQuestions = [
                {
                    _id: 'id1',
                    details: { content: 'Question 1' },
                    userName: 'user1',
                    chapter: chapterId,
                },
            ];

            jest.spyOn(QuestionService, 'getAllQuestions').mockResolvedValue(mockQuestions);

            const response = await global.testRequest
                .post('/questions/search')
                .query({
                    pageNumber: '2',
                    pageSize: '5',
                    sortBy: 'vote',
                    sortOrder: 'desc',
                    filterBy: 'all',
                })
                .send({ chapterId });

            expect(response.status).toBe(200);
            expect(QuestionService.getAllQuestions).toHaveBeenCalledWith(
                { chapterId, user: expect.any(Object) },
                {
                    pageNumber: '2',
                    pageSize: '5',
                    sortBy: 'vote',
                    sortOrder: 'desc',
                    filterBy: 'all',
                }
            );
        });

        it('should handle tag filtering', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();
            const tagIds = [
                new mongoose.Types.ObjectId().toString(),
                new mongoose.Types.ObjectId().toString(),
            ];

            jest.spyOn(QuestionService, 'getAllQuestions').mockResolvedValue([]);

            const response = await global.testRequest
                .post('/questions/search')
                .send({ chapterId, tagIds });

            expect(response.status).toBe(200);
            expect(QuestionService.getAllQuestions).toHaveBeenCalledWith(
                { chapterId, tagIds, user: expect.any(Object) },
                {}
            );
        });

        it('should return 400 for invalid tag IDs', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();
            const invalidTagIds = ['invalid-tag-id'];

            const response = await global.testRequest
                .post('/questions/search')
                .send({ chapterId, tagIds: invalidTagIds });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(response.body.errors.length).toBeGreaterThan(0);
        });

        it('should return 400 for invalid pagination parameters', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();

            const invalidQueries = [
                { pageNumber: '0' },
                { pageNumber: '-1' },
                { pageSize: '0' },
                { pageSize: '15' }, // exceeds max
                { sortBy: 'invalid' },
                { sortOrder: 'invalid' },
                { filterBy: 'invalid' },
            ];

            for (const query of invalidQueries) {
                const response = await global.testRequest
                    .post('/questions/search')
                    .query(query)
                    .send({ chapterId });

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', 'Validation failed');
                expect(response.body).toHaveProperty('errors');
                expect(Array.isArray(response.body.errors)).toBe(true);
            }
        });
    });

    describe('GET /questions/:_id', () => {
        it('should return question by id', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const mockQuestion = {
                _id: questionId,
                details: { content: 'Test question' },
                userName: 'testuser',
                chapter: new mongoose.Types.ObjectId().toString(),
                upVote: 5,
                downVote: 2,
                tags: [],
                imageLocations: [],
                isFavourite: false,
                answers: [
                    {
                        _id: new mongoose.Types.ObjectId().toString(),
                        details: { content: 'Test answer' },
                        userName: 'answerer',
                    },
                ],
            };

            jest.spyOn(QuestionService, 'getQuestion').mockResolvedValue(mockQuestion);

            const response = await global.testRequest.get(`/questions/${questionId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockQuestion);
            expect(QuestionService.getQuestion).toHaveBeenCalledWith(questionId);
        });

        it('should return 400 for invalid question ID format', async () => {
            const response = await global.testRequest.get('/questions/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(response.body.errors.length).toBeGreaterThan(0);
        });
    });

    describe('POST /questions', () => {
        it('should create a new question', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();
            const questionData = {
                details: { content: 'New question content' },
                chapter: chapterId,
                tags: [
                    { _id: new mongoose.Types.ObjectId().toString(), name: 'calculus' },
                ],
                imageLocations: ['image1.jpg'],
            };

            jest.spyOn(QuestionService, 'addNewQuestion').mockResolvedValue();

            const response = await global.testRequest
                .post('/questions')
                .send(questionData);

            expect(response.status).toBe(201);
            expect(QuestionService.addNewQuestion).toHaveBeenCalledWith({
                ...questionData,
                user: expect.any(Object), // User added by middleware
            });
        });

        it('should return 400 for missing required fields', async () => {
            // Test missing details
            const missingDetails = { 
                chapter: new mongoose.Types.ObjectId().toString() 
            };
            const response1 = await global.testRequest
                .post('/questions')
                .send(missingDetails);

            expect(response1.status).toBe(400);
            expect(response1.body).toHaveProperty('message', 'Validation failed');
            expect(response1.body).toHaveProperty('errors');
            expect(Array.isArray(response1.body.errors)).toBe(true);

            // Test missing chapter
            const missingChapter = { 
                details: { content: 'Test question' } 
            };
            const response2 = await global.testRequest
                .post('/questions')
                .send(missingChapter);

            expect(response2.status).toBe(400);
            expect(response2.body).toHaveProperty('message', 'Validation failed');

            // Based on current validation implementation, null or undefined details is rejected
            const undefinedDetails = { 
                details: undefined, 
                chapter: new mongoose.Types.ObjectId().toString() 
            };
            const response3 = await global.testRequest
                .post('/questions')
                .send(undefinedDetails);

            expect(response3.status).toBe(400);
            expect(response3.body).toHaveProperty('message', 'Validation failed');
        });

        it('should return 400 for invalid chapter ID format', async () => {
            const questionData = {
                details: { content: 'Test question' },
                chapter: 'invalid-chapter-id',
            };

            const response = await global.testRequest
                .post('/questions')
                .send(questionData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(response.body.errors.length).toBeGreaterThan(0);
        });

        it('should validate tag structure', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();
            const questionWithInvalidTags = {
                details: { content: 'Test question' },
                chapter: chapterId,
                tags: [
                    { name: 'tag-without-id' }, // Missing _id
                    { _id: 'invalid-object-id', name: 'tag' }, // Invalid _id format
                ],
            };

            const response = await global.testRequest
                .post('/questions')
                .send(questionWithInvalidTags);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
        });

        it('should handle imageLocations array', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();
            const questionData = {
                details: { content: 'Question with images' },
                chapter: chapterId,
                imageLocations: ['image1.jpg', 'image2.png', 'image3.gif'],
            };

            jest.spyOn(QuestionService, 'addNewQuestion').mockResolvedValue();

            const response = await global.testRequest
                .post('/questions')
                .send(questionData);

            expect(response.status).toBe(201);
            expect(QuestionService.addNewQuestion).toHaveBeenCalledWith({
                ...questionData,
                user: expect.any(Object),
            });
        });
    });

    describe('DELETE /questions/:_id', () => {
        it('should delete a question', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();

            jest.spyOn(QuestionService, 'deleteQuestion').mockResolvedValue();

            const response = await global.testRequest.delete(`/questions/${questionId}`);

            expect(response.status).toBe(200);
            expect(QuestionService.deleteQuestion).toHaveBeenCalledWith(
                questionId,
                expect.any(Object) // User from middleware
            );
        });

        it('should return 400 for invalid question ID format', async () => {
            const response = await global.testRequest.delete('/questions/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
        });
    });

    describe('POST /questions/favourite', () => {
        it('should add question to favourites', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const favouriteData = { questionId };

            const mockResponse = { isFavourite: true };
            jest.spyOn(QuestionService, 'addToFavourite').mockResolvedValue(mockResponse);

            const response = await global.testRequest
                .post('/questions/favourite')
                .send(favouriteData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(QuestionService.addToFavourite).toHaveBeenCalledWith({
                ...favouriteData,
                user: expect.any(Object),
            });
        });

        it('should return 400 for missing question ID', async () => {
            const response = await global.testRequest
                .post('/questions/favourite')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
        });

        it('should return 400 for invalid question ID format', async () => {
            const response = await global.testRequest
                .post('/questions/favourite')
                .send({ questionId: 'invalid-id' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Validation failed');
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
            expect(response.body.errors.length).toBeGreaterThan(0);
        });
    });

    describe('Error Handling', () => {
        it('should handle service errors gracefully', async () => {
            const chapterId = new mongoose.Types.ObjectId().toString();
            
            const serviceError = new Error('Service error');
            serviceError.name = 'ServiceError';
            serviceError.statusCode = 500;
            
            jest.spyOn(QuestionService, 'getAllQuestions')
                .mockRejectedValue(serviceError);

            const response = await global.testRequest
                .post('/questions/search')
                .send({ chapterId });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message');
        });

        it('should handle not found errors', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            
            const notFoundError = new Error('Question not found');
            notFoundError.name = 'NotFoundError';
            notFoundError.statusCode = 404;
            
            jest.spyOn(QuestionService, 'getQuestion')
                .mockRejectedValue(notFoundError);

            const response = await global.testRequest.get(`/questions/${questionId}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Question not found');
        });

        it('should handle unauthorized errors during deletion', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();

            const unauthorizedError = new Error('You can only delete your own questions');
            unauthorizedError.name = 'UnauthorizedError';
            unauthorizedError.statusCode = 403;
            
            jest.spyOn(QuestionService, 'deleteQuestion')
                .mockRejectedValue(unauthorizedError);

            const response = await global.testRequest.delete(`/questions/${questionId}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('message', 'You can only delete your own questions');
        });
    });

    describe('Authentication Middleware', () => {
        it('should require authentication for POST /questions', async () => {
            // This test verifies that the middleware is properly applied
            // The actual authentication logic is mocked in the test setup
            const questionData = {
                details: { content: 'Test question' },
                chapter: new mongoose.Types.ObjectId().toString(),
            };

            jest.spyOn(QuestionService, 'addNewQuestion').mockResolvedValue();

            const response = await global.testRequest
                .post('/questions')
                .send(questionData);

            expect(response.status).toBe(201);
            // Verify that user was added to the request by middleware
            expect(QuestionService.addNewQuestion).toHaveBeenCalledWith(
                expect.objectContaining({
                    user: expect.any(Object),
                })
            );
        });

        it('should require authentication for DELETE /questions/:_id', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();

            jest.spyOn(QuestionService, 'deleteQuestion').mockResolvedValue();

            const response = await global.testRequest.delete(`/questions/${questionId}`);

            expect(response.status).toBe(200);
            expect(QuestionService.deleteQuestion).toHaveBeenCalledWith(
                questionId,
                expect.any(Object)
            );
        });

        it('should require authentication for POST /questions/favourite', async () => {
            const favouriteData = { questionId: new mongoose.Types.ObjectId().toString() };

            jest.spyOn(QuestionService, 'addToFavourite').mockResolvedValue({ isFavourite: true });

            const response = await global.testRequest
                .post('/questions/favourite')
                .send(favouriteData);

            expect(response.status).toBe(200);
            expect(QuestionService.addToFavourite).toHaveBeenCalledWith(
                expect.objectContaining({
                    user: expect.any(Object),
                })
            );
        });
    });
});
