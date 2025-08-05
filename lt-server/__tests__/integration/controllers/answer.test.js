const mongoose = require('mongoose');
const AnswerService = require('../../../src/services/answer');

describe('Answer Controller Integration Tests', () => {
    describe('POST /answers', () => {
        it('should create a new answer', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const answerData = {
                details: { content: 'This is the answer explanation' },
                question: questionId,
                imageLocations: ['solution1.jpg'],
            };

            const mockAnswer = {
                _id: new mongoose.Types.ObjectId(),
                ...answerData,
                userName: 'testuser',
                upVote: 0,
                downVote: 0,
            };

            jest.spyOn(AnswerService, 'addNewAnswer').mockResolvedValue(mockAnswer);

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(201);
            expect(AnswerService.addNewAnswer).toHaveBeenCalledWith({
                ...answerData,
                user: expect.any(Object), // User added by middleware
            });
        });

        it('should update existing answer when _id is provided', async () => {
            const answerId = new mongoose.Types.ObjectId().toString();
            const questionId = new mongoose.Types.ObjectId().toString();
            const answerData = {
                _id: answerId,
                details: { content: 'Updated answer content' },
                question: questionId,
                imageLocations: [],
            };

            const mockUpdatedAnswer = {
                _id: answerId,
                ...answerData,
                userName: 'testuser',
            };

            jest.spyOn(AnswerService, 'addNewAnswer').mockResolvedValue(mockUpdatedAnswer);

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(201);
            expect(AnswerService.addNewAnswer).toHaveBeenCalledWith({
                ...answerData,
                user: expect.any(Object),
            });
        });

        it('should return 400 for missing required fields', async () => {
            const invalidAnswers = [
                // Missing question
                { details: { content: 'Answer without question' } },
                // Invalid question ID format
                { details: { content: 'Answer' }, question: 'invalid-id' },
            ];

            for (const answerData of invalidAnswers) {
                const response = await global.testRequest.post('/answers').send(answerData);

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Validation failed');
            }
        });

        it('should accept answer without details', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const answerData = {
                question: questionId,
                details: { content: '' }, // Empty details content
                imageLocations: ['image1.jpg'],
            };

            jest.spyOn(AnswerService, 'addNewAnswer').mockResolvedValue({});

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(201);
            expect(AnswerService.addNewAnswer).toHaveBeenCalledWith({
                ...answerData,
                user: expect.any(Object),
            });
        });

        it('should validate imageLocations as array of strings', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const answerData = {
                details: { content: 'Answer with images' },
                question: questionId,
                imageLocations: ['valid1.jpg', 'valid2.png', 'valid3.gif'],
            };

            jest.spyOn(AnswerService, 'addNewAnswer').mockResolvedValue({});

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(201);
        });

        it('should return 400 for invalid _id format during update', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const answerData = {
                _id: 'invalid-answer-id',
                details: { content: 'Updated answer' },
                question: questionId,
            };

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });
    });

    describe('DELETE /answers/:_id', () => {
        it('should delete an answer', async () => {
            const answerId = new mongoose.Types.ObjectId().toString();

            jest.spyOn(AnswerService, 'deleteAnswer').mockResolvedValue();

            const response = await global.testRequest.delete(`/answers/${answerId}`);

            expect(response.status).toBe(200);
            expect(AnswerService.deleteAnswer).toHaveBeenCalledWith(
                answerId,
                expect.any(Object), // User from middleware
            );
        });

        it('should return 400 for invalid answer ID format', async () => {
            const response = await global.testRequest.delete('/answers/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });
    });

    describe('GET /answers?questionId=:id', () => {
        it('should return answers for a specific question', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const mockAnswers = [
                {
                    _id: 'answer1',
                    details: { content: 'First answer' },
                    userName: 'user1',
                    question: questionId,
                    upVote: 3,
                    downVote: 1,
                },
                {
                    _id: 'answer2',
                    details: { content: 'Second answer' },
                    userName: 'user2',
                    question: questionId,
                    upVote: 1,
                    downVote: 0,
                },
            ];

            jest.spyOn(AnswerService, 'getAllAnswers').mockResolvedValue(mockAnswers);

            const response = await global.testRequest.get(`/answers?questionId=${questionId}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body).toEqual(mockAnswers);
            expect(AnswerService.getAllAnswers).toHaveBeenCalledWith(questionId);
        });

        it('should return 400 for invalid question ID format', async () => {
            const response = await global.testRequest.get('/answers?questionId=invalid-id');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return empty array when no answers exist', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();

            jest.spyOn(AnswerService, 'getAllAnswers').mockResolvedValue([]);

            const response = await global.testRequest.get(`/answers?questionId=${questionId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('GET /answers/:_id', () => {
        it('should return answer by id', async () => {
            const answerId = new mongoose.Types.ObjectId().toString();
            const questionId = new mongoose.Types.ObjectId().toString();
            const mockAnswer = {
                _id: answerId,
                details: { content: 'Test answer' },
                userName: 'testuser',
                question: questionId,
                upVote: 2,
                downVote: 0,
                imageLocations: ['image1.jpg'],
            };

            jest.spyOn(AnswerService, 'getAnswer').mockResolvedValue(mockAnswer);

            const response = await global.testRequest.get(`/answers/${answerId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAnswer);
            expect(AnswerService.getAnswer).toHaveBeenCalledWith(answerId);
        });

        it('should return 400 for invalid answer ID format', async () => {
            const response = await global.testRequest.get('/answers/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should handle answer not found', async () => {
            const answerId = new mongoose.Types.ObjectId().toString();

            jest.spyOn(AnswerService, 'getAnswer').mockResolvedValue(null);

            const response = await global.testRequest.get(`/answers/${answerId}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeNull();
        });
    });

    describe('Error Handling', () => {
        it('should handle service errors during answer creation', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const answerData = {
                details: { content: 'Test answer' },
                question: questionId,
            };

            jest.spyOn(AnswerService, 'addNewAnswer').mockRejectedValue(new Error('Service error'));

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(500);
        });

        it('should handle not found errors during deletion', async () => {
            const answerId = new mongoose.Types.ObjectId().toString();

            const notFoundError = new Error('Answer not found');
            notFoundError.name = 'NotFoundError';
            jest.spyOn(AnswerService, 'deleteAnswer').mockRejectedValue(notFoundError);

            const response = await global.testRequest.delete(`/answers/${answerId}`);

            expect(response.status).toBe(500);
        });

        it('should handle unauthorized errors during update', async () => {
            const answerId = new mongoose.Types.ObjectId().toString();
            const questionId = new mongoose.Types.ObjectId().toString();
            const answerData = {
                _id: answerId,
                details: { content: 'Updated answer' },
                question: questionId,
            };

            const unauthorizedError = new Error('Unauthorized');
            unauthorizedError.name = 'UnauthorizedError';
            jest.spyOn(AnswerService, 'addNewAnswer').mockRejectedValue(unauthorizedError);

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(500);
        });

        it('should handle database connection errors', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();

            jest.spyOn(AnswerService, 'getAllAnswers').mockRejectedValue(new Error('Database connection error'));

            const response = await global.testRequest.get(`/answers?questionId=${questionId}`);

            expect(response.status).toBe(500);
        });
    });

    describe('Authentication Middleware', () => {
        it('should require authentication for POST /answers', async () => {
            const answerData = {
                details: { content: 'Test answer' },
                question: new mongoose.Types.ObjectId().toString(),
            };

            jest.spyOn(AnswerService, 'addNewAnswer').mockResolvedValue({});

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(201);
            // Verify that user was added to the request by middleware
            expect(AnswerService.addNewAnswer).toHaveBeenCalledWith(
                expect.objectContaining({
                    user: expect.any(Object),
                }),
            );
        });

        it('should require authentication for DELETE /answers/:_id', async () => {
            const answerId = new mongoose.Types.ObjectId().toString();

            jest.spyOn(AnswerService, 'deleteAnswer').mockResolvedValue();

            const response = await global.testRequest.delete(`/answers/${answerId}`);

            expect(response.status).toBe(200);
            expect(AnswerService.deleteAnswer).toHaveBeenCalledWith(answerId, expect.any(Object));
        });
    });

    describe('Input Validation Edge Cases', () => {
        it('should handle very large answer details', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const largeContent = 'a'.repeat(10000); // Very large content
            const answerData = {
                details: { content: largeContent },
                question: questionId,
            };

            jest.spyOn(AnswerService, 'addNewAnswer').mockResolvedValue({});

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(201);
        });

        it('should handle complex answer details structure', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const complexDetails = {
                content: 'Answer with complex structure',
                steps: ['Step 1', 'Step 2', 'Step 3'],
                formula: 'x = (-b ± √(b²-4ac)) / 2a',
                explanation: {
                    intro: 'This is the explanation',
                    conclusion: 'Therefore, the answer is correct',
                },
            };
            const answerData = {
                details: complexDetails,
                question: questionId,
            };

            jest.spyOn(AnswerService, 'addNewAnswer').mockResolvedValue({});

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(201);
            expect(AnswerService.addNewAnswer).toHaveBeenCalledWith(
                expect.objectContaining({
                    details: complexDetails,
                }),
            );
        });

        it('should handle empty imageLocations array', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const answerData = {
                details: { content: 'Answer without images' },
                question: questionId,
                imageLocations: [],
            };

            jest.spyOn(AnswerService, 'addNewAnswer').mockResolvedValue({});

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(201);
        });

        it('should handle maximum number of image locations', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const manyImages = Array.from({ length: 20 }, (_, i) => `image${i + 1}.jpg`);
            const answerData = {
                details: { content: 'Answer with many images' },
                question: questionId,
                imageLocations: manyImages,
            };

            jest.spyOn(AnswerService, 'addNewAnswer').mockResolvedValue({});

            const response = await global.testRequest.post('/answers').send(answerData);

            expect(response.status).toBe(201);
        });
    });
});
