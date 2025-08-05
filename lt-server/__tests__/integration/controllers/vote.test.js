const mongoose = require('mongoose');
const VoteService = require('../../../src/services/vote');

describe('Vote Controller Integration Tests', () => {
    describe('POST /votes/update', () => {
        it('should create upvote for a question', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const voteData = {
                qaId: questionId,
                q: true, // question
                up: true, // upvote
            };

            const mockResponse = {
                upVote: 6,
                downVote: 2,
            };

            jest.spyOn(VoteService, 'updateVote').mockResolvedValue(mockResponse);

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(VoteService.updateVote).toHaveBeenCalledWith({
                ...voteData,
                user: expect.any(Object), // User added by middleware
            });
        });

        it('should create downvote for a question', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const voteData = {
                qaId: questionId,
                q: true, // question
                up: false, // downvote
            };

            const mockResponse = {
                upVote: 5,
                downVote: 3,
            };

            jest.spyOn(VoteService, 'updateVote').mockResolvedValue(mockResponse);

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(VoteService.updateVote).toHaveBeenCalledWith({
                ...voteData,
                user: expect.any(Object),
            });
        });

        it('should create upvote for an answer', async () => {
            const answerId = new mongoose.Types.ObjectId().toString();
            const voteData = {
                qaId: answerId,
                q: false, // answer
                up: true, // upvote
            };

            const mockResponse = {
                upVote: 4,
                downVote: 1,
            };

            jest.spyOn(VoteService, 'updateVote').mockResolvedValue(mockResponse);

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(VoteService.updateVote).toHaveBeenCalledWith({
                ...voteData,
                user: expect.any(Object),
            });
        });

        it('should create downvote for an answer', async () => {
            const answerId = new mongoose.Types.ObjectId().toString();
            const voteData = {
                qaId: answerId,
                q: false, // answer
                up: false, // downvote
            };

            const mockResponse = {
                upVote: 3,
                downVote: 2,
            };

            jest.spyOn(VoteService, 'updateVote').mockResolvedValue(mockResponse);

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(VoteService.updateVote).toHaveBeenCalledWith({
                ...voteData,
                user: expect.any(Object),
            });
        });

        it('should return 400 for missing required fields', async () => {
            const invalidVotes = [
                // Missing qaId
                { q: true, up: true },
                // Missing q (isQuestion)
                { qaId: new mongoose.Types.ObjectId().toString(), up: true },
                // Missing up (vote direction)
                { qaId: new mongoose.Types.ObjectId().toString(), q: true },
                // All fields missing
                {},
            ];

            for (const voteData of invalidVotes) {
                const response = await global.testRequest.post('/votes/update').send(voteData);

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Validation failed');
            }
        });

        it('should return 400 for invalid qaId format', async () => {
            const voteData = {
                qaId: 'invalid-object-id',
                q: true,
                up: true,
            };

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should return 400 for invalid boolean values', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const invalidBooleanVotes = [
                // Invalid q value
                { qaId: questionId, q: 'true', up: true },
                { qaId: questionId, q: 'question', up: true },
                { qaId: questionId, q: 1, up: true },
                // Invalid up value
                { qaId: questionId, q: true, up: 'true' },
                { qaId: questionId, q: true, up: 'upvote' },
                { qaId: questionId, q: true, up: 1 },
            ];

            for (const voteData of invalidBooleanVotes) {
                const response = await global.testRequest.post('/votes/update').send(voteData);

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Validation failed');
            }
        });

        it('should handle vote changes (upvote to downvote)', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const voteData = {
                qaId: questionId,
                q: true,
                up: false, // Changing to downvote
            };

            const mockResponse = {
                upVote: 4, // Decreased from previous upvote
                downVote: 3, // Increased from new downvote
            };

            jest.spyOn(VoteService, 'updateVote').mockResolvedValue(mockResponse);

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it('should handle vote removal (same vote clicked twice)', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const voteData = {
                qaId: questionId,
                q: true,
                up: true, // Clicking upvote again to remove it
            };

            const mockResponse = {
                upVote: 5, // No change if vote was already there
                downVote: 2,
            };

            jest.spyOn(VoteService, 'updateVote').mockResolvedValue(mockResponse);

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });
    });

    describe('Authentication Middleware', () => {
        it('should require authentication for voting', async () => {
            const voteData = {
                qaId: new mongoose.Types.ObjectId().toString(),
                q: true,
                up: true,
            };

            jest.spyOn(VoteService, 'updateVote').mockResolvedValue({
                upVote: 1,
                downVote: 0,
            });

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(200);
            // Verify that user was added to the request by middleware
            expect(VoteService.updateVote).toHaveBeenCalledWith(
                expect.objectContaining({
                    user: expect.any(Object),
                }),
            );
        });
    });

    describe('Error Handling', () => {
        it('should handle service errors', async () => {
            const voteData = {
                qaId: new mongoose.Types.ObjectId().toString(),
                q: true,
                up: true,
            };

            jest.spyOn(VoteService, 'updateVote').mockRejectedValue(new Error('Service error'));

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(500);
        });

        it('should handle not found errors', async () => {
            const voteData = {
                qaId: new mongoose.Types.ObjectId().toString(),
                q: true,
                up: true,
            };

            const notFoundError = new Error('Question not found');
            notFoundError.name = 'NotFoundError';
            jest.spyOn(VoteService, 'updateVote').mockRejectedValue(notFoundError);

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(500);
        });

        it('should handle database connection errors', async () => {
            const voteData = {
                qaId: new mongoose.Types.ObjectId().toString(),
                q: true,
                up: true,
            };

            jest.spyOn(VoteService, 'updateVote').mockRejectedValue(new Error('Database connection error'));

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(500);
        });
    });

    describe('Concurrent Voting Scenarios', () => {
        it('should handle rapid vote changes', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();

            // Simulate rapid clicking - upvote, then downvote, then upvote again
            const voteSequence = [
                { qaId: questionId, q: true, up: true },
                { qaId: questionId, q: true, up: false },
                { qaId: questionId, q: true, up: true },
            ];

            const expectedResponses = [
                { upVote: 6, downVote: 2 },
                { upVote: 4, downVote: 3 },
                { upVote: 5, downVote: 2 },
            ];

            for (let i = 0; i < voteSequence.length; i++) {
                jest.spyOn(VoteService, 'updateVote').mockResolvedValueOnce(expectedResponses[i]);

                const response = await global.testRequest.post('/votes/update').send(voteSequence[i]);

                expect(response.status).toBe(200);
                expect(response.body).toEqual(expectedResponses[i]);
            }
        });

        it('should handle voting on multiple questions by same user', async () => {
            const question1Id = new mongoose.Types.ObjectId().toString();
            const question2Id = new mongoose.Types.ObjectId().toString();

            const votes = [
                { qaId: question1Id, q: true, up: true },
                { qaId: question2Id, q: true, up: false },
            ];

            const responses = [
                { upVote: 6, downVote: 1 },
                { upVote: 2, downVote: 4 },
            ];

            for (let i = 0; i < votes.length; i++) {
                jest.spyOn(VoteService, 'updateVote').mockResolvedValueOnce(responses[i]);

                const response = await global.testRequest.post('/votes/update').send(votes[i]);

                expect(response.status).toBe(200);
                expect(response.body).toEqual(responses[i]);
            }
        });

        it('should handle voting on both questions and answers', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const answerId = new mongoose.Types.ObjectId().toString();

            const votes = [
                { qaId: questionId, q: true, up: true }, // Upvote question
                { qaId: answerId, q: false, up: true }, // Upvote answer
                { qaId: questionId, q: true, up: false }, // Downvote same question
                { qaId: answerId, q: false, up: false }, // Downvote same answer
            ];

            const responses = [
                { upVote: 6, downVote: 2 }, // Question upvoted
                { upVote: 4, downVote: 1 }, // Answer upvoted
                { upVote: 4, downVote: 3 }, // Question vote changed to downvote
                { upVote: 3, downVote: 2 }, // Answer vote changed to downvote
            ];

            for (let i = 0; i < votes.length; i++) {
                jest.spyOn(VoteService, 'updateVote').mockResolvedValueOnce(responses[i]);

                const response = await global.testRequest.post('/votes/update').send(votes[i]);

                expect(response.status).toBe(200);
                expect(response.body).toEqual(responses[i]);
            }
        });
    });

    describe('Vote Count Edge Cases', () => {
        it('should handle zero vote counts', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const voteData = {
                qaId: questionId,
                q: true,
                up: true,
            };

            const mockResponse = {
                upVote: 1, // First upvote
                downVote: 0,
            };

            jest.spyOn(VoteService, 'updateVote').mockResolvedValue(mockResponse);

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it('should handle high vote counts', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const voteData = {
                qaId: questionId,
                q: true,
                up: true,
            };

            const mockResponse = {
                upVote: 9999,
                downVote: 1,
            };

            jest.spyOn(VoteService, 'updateVote').mockResolvedValue(mockResponse);

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it('should handle negative net vote scenarios', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();
            const voteData = {
                qaId: questionId,
                q: true,
                up: false, // Adding another downvote
            };

            const mockResponse = {
                upVote: 1,
                downVote: 5, // More downvotes than upvotes
            };

            jest.spyOn(VoteService, 'updateVote').mockResolvedValue(mockResponse);

            const response = await global.testRequest.post('/votes/update').send(voteData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });
    });

    describe('Request Validation Edge Cases', () => {
        it('should handle ObjectId edge cases', async () => {
            const validObjectIds = [
                new mongoose.Types.ObjectId().toString(), // Standard ObjectId
                '507f1f77bcf86cd799439011', // 24-character hex string
                '507f1f77bcf86cd799439012', // Another valid ObjectId
            ];

            for (const qaId of validObjectIds) {
                const voteData = {
                    qaId,
                    q: true,
                    up: true,
                };

                jest.spyOn(VoteService, 'updateVote').mockResolvedValue({
                    upVote: 1,
                    downVote: 0,
                });

                const response = await global.testRequest.post('/votes/update').send(voteData);

                expect(response.status).toBe(200);
            }
        });

        it('should handle strict boolean validation', async () => {
            const questionId = new mongoose.Types.ObjectId().toString();

            // Test valid boolean combinations
            const validBooleanCombinations = [
                { q: true, up: true },
                { q: true, up: false },
                { q: false, up: true },
                { q: false, up: false },
            ];

            for (const booleans of validBooleanCombinations) {
                const voteData = {
                    qaId: questionId,
                    ...booleans,
                };

                jest.spyOn(VoteService, 'updateVote').mockResolvedValue({
                    upVote: 1,
                    downVote: 0,
                });

                const response = await global.testRequest.post('/votes/update').send(voteData);

                expect(response.status).toBe(200);
            }
        });
    });
});
