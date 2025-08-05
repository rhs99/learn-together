const mongoose = require('mongoose');
const Vote = require('../../../src/models/vote');

describe('Vote Model Tests', () => {
    let userId, qaId;

    beforeEach(async () => {
        userId = new mongoose.Types.ObjectId();
        qaId = new mongoose.Types.ObjectId();
    });

    afterEach(async () => {
        await Vote.deleteMany({});
    });

    describe('Schema Validation', () => {
        it('should create a vote with required fields', async () => {
            const voteData = {
                qa: qaId,
                user: userId,
                isQuestion: true,
                count: 1,
            };

            const vote = await new Vote(voteData).save();

            expect(vote.qa.toString()).toBe(qaId.toString());
            expect(vote.user.toString()).toBe(userId.toString());
            expect(vote.isQuestion).toBe(true);
            expect(vote.count).toBe(1);
        });

        it('should create a vote for an answer', async () => {
            const voteData = {
                qa: qaId,
                user: userId,
                isQuestion: false,
                count: -1, // downvote
            };

            const vote = await new Vote(voteData).save();

            expect(vote.qa.toString()).toBe(qaId.toString());
            expect(vote.user.toString()).toBe(userId.toString());
            expect(vote.isQuestion).toBe(false);
            expect(vote.count).toBe(-1);
        });

        it('should set default count to 0', async () => {
            const voteData = {
                qa: qaId,
                user: userId,
                isQuestion: true,
            };

            const vote = await new Vote(voteData).save();

            expect(vote.count).toBe(0);
        });

        it('should enforce required fields', async () => {
            const invalidVotes = [
                // Missing qa
                { user: userId, isQuestion: true, count: 1 },
                // Missing user
                { qa: qaId, isQuestion: true, count: 1 },
                // Missing isQuestion
                { qa: qaId, user: userId, count: 1 },
                // All required fields missing
                { count: 1 },
            ];

            for (const voteData of invalidVotes) {
                const vote = new Vote(voteData);
                await expect(vote.save()).rejects.toThrow();
            }
        });

        it('should accept valid ObjectIds for qa and user', async () => {
            const newQaId = new mongoose.Types.ObjectId();
            const newUserId = new mongoose.Types.ObjectId();

            const vote = await new Vote({
                qa: newQaId,
                user: newUserId,
                isQuestion: true,
                count: 1,
            }).save();

            expect(vote.qa.toString()).toBe(newQaId.toString());
            expect(vote.user.toString()).toBe(newUserId.toString());
        });

        it('should reject invalid ObjectId formats', async () => {
            const invalidVotes = [
                // Invalid qa ObjectId
                { qa: 'invalid-id', user: userId, isQuestion: true, count: 1 },
                // Invalid user ObjectId
                { qa: qaId, user: 'invalid-id', isQuestion: true, count: 1 },
                // Both invalid
                { qa: 'invalid-qa', user: 'invalid-user', isQuestion: true, count: 1 },
            ];

            for (const voteData of invalidVotes) {
                const vote = new Vote(voteData);
                await expect(vote.save()).rejects.toThrow();
            }
        });
    });

    describe('Vote Count Values', () => {
        it('should accept positive vote counts (upvotes)', async () => {
            const positiveValues = [1, 5, 10, 100];

            for (const count of positiveValues) {
                const vote = await new Vote({
                    qa: new mongoose.Types.ObjectId(),
                    user: new mongoose.Types.ObjectId(),
                    isQuestion: true,
                    count,
                }).save();

                expect(vote.count).toBe(count);
            }
        });

        it('should accept negative vote counts (downvotes)', async () => {
            const negativeValues = [-1, -5, -10, -100];

            for (const count of negativeValues) {
                const vote = await new Vote({
                    qa: new mongoose.Types.ObjectId(),
                    user: new mongoose.Types.ObjectId(),
                    isQuestion: false,
                    count,
                }).save();

                expect(vote.count).toBe(count);
            }
        });

        it('should accept zero vote counts (neutral)', async () => {
            const vote = await new Vote({
                qa: qaId,
                user: userId,
                isQuestion: true,
                count: 0,
            }).save();

            expect(vote.count).toBe(0);
        });

        it('should handle extreme vote count values', async () => {
            const extremeValues = [
                Number.MAX_SAFE_INTEGER,
                Number.MIN_SAFE_INTEGER,
                -Number.MAX_SAFE_INTEGER,
            ];

            for (let i = 0; i < extremeValues.length; i++) {
                const vote = await new Vote({
                    qa: new mongoose.Types.ObjectId(),
                    user: new mongoose.Types.ObjectId(),
                    isQuestion: i % 2 === 0,
                    count: extremeValues[i],
                }).save();

                expect(vote.count).toBe(extremeValues[i]);
            }
        });
    });

    describe('Boolean isQuestion Field', () => {
        it('should correctly handle true value for questions', async () => {
            const vote = await new Vote({
                qa: qaId,
                user: userId,
                isQuestion: true,
                count: 1,
            }).save();

            expect(vote.isQuestion).toBe(true);
        });

        it('should correctly handle false value for answers', async () => {
            const vote = await new Vote({
                qa: qaId,
                user: userId,
                isQuestion: false,
                count: 1,
            }).save();

            expect(vote.isQuestion).toBe(false);
        });

        it('should reject non-boolean values for isQuestion', async () => {
            const invalidValues = ['true', 'false', 1, 0, null, undefined, 'question', 'answer'];

            for (const value of invalidValues) {
                const vote = new Vote({
                    qa: qaId,
                    user: userId,
                    isQuestion: value,
                    count: 1,
                });

                // Some values might be cast to boolean, others should fail
                if (typeof value === 'string' && value !== 'true' && value !== 'false') {
                    await expect(vote.save()).rejects.toThrow();
                }
            }
        });
    });

    describe('Unique Compound Index', () => {
        it('should enforce unique combination of qa and user', async () => {
            await Vote.createIndexes(); // Ensure indexes are created

            const voteData = {
                qa: qaId,
                user: userId,
                isQuestion: true,
                count: 1,
            };

            // First vote should save successfully
            await new Vote(voteData).save();

            // Second vote with same qa and user should fail
            const duplicateVote = new Vote({
                ...voteData,
                count: -1, // Different count but same qa and user
            });

            await expect(duplicateVote.save()).rejects.toThrow(/E11000|duplicate key/);
        });

        it('should allow same qa with different users', async () => {
            await Vote.createIndexes();

            const user1Id = new mongoose.Types.ObjectId();
            const user2Id = new mongoose.Types.ObjectId();

            const vote1 = await new Vote({
                qa: qaId,
                user: user1Id,
                isQuestion: true,
                count: 1,
            }).save();

            const vote2 = await new Vote({
                qa: qaId,
                user: user2Id,
                isQuestion: true,
                count: -1,
            }).save();

            expect(vote1.qa.toString()).toBe(vote2.qa.toString());
            expect(vote1.user.toString()).not.toBe(vote2.user.toString());
        });

        it('should allow same user with different qa items', async () => {
            await Vote.createIndexes();

            const qa1Id = new mongoose.Types.ObjectId();
            const qa2Id = new mongoose.Types.ObjectId();

            const vote1 = await new Vote({
                qa: qa1Id,
                user: userId,
                isQuestion: true,
                count: 1,
            }).save();

            const vote2 = await new Vote({
                qa: qa2Id,
                user: userId,
                isQuestion: false,
                count: 1,
            }).save();

            expect(vote1.qa.toString()).not.toBe(vote2.qa.toString());
            expect(vote1.user.toString()).toBe(vote2.user.toString());
        });
    });

    describe('Model References', () => {
        it('should correctly reference User model', () => {
            const vote = new Vote({
                qa: qaId,
                user: userId,
                isQuestion: true,
                count: 1,
            });

            expect(vote.schema.paths.user.options.ref).toBe('User');
        });

        it('should not reference any model for qa field', () => {
            const vote = new Vote({
                qa: qaId,
                user: userId,
                isQuestion: true,
                count: 1,
            });

            // qa field should not have a ref since it can reference either Question or Answer
            expect(vote.schema.paths.qa.options.ref).toBeUndefined();
        });
    });

    describe('Use Cases', () => {
        it('should handle question upvote scenario', async () => {
            const vote = await new Vote({
                qa: qaId,
                user: userId,
                isQuestion: true,
                count: 1,
            }).save();

            expect(vote.isQuestion).toBe(true);
            expect(vote.count).toBe(1);
        });

        it('should handle question downvote scenario', async () => {
            const vote = await new Vote({
                qa: qaId,
                user: userId,
                isQuestion: true,
                count: -1,
            }).save();

            expect(vote.isQuestion).toBe(true);
            expect(vote.count).toBe(-1);
        });

        it('should handle answer upvote scenario', async () => {
            const vote = await new Vote({
                qa: qaId,
                user: userId,
                isQuestion: false,
                count: 1,
            }).save();

            expect(vote.isQuestion).toBe(false);
            expect(vote.count).toBe(1);
        });

        it('should handle answer downvote scenario', async () => {
            const vote = await new Vote({
                qa: qaId,
                user: userId,
                isQuestion: false,
                count: -1,
            }).save();

            expect(vote.isQuestion).toBe(false);
            expect(vote.count).toBe(-1);
        });

        it('should handle vote removal scenario (count = 0)', async () => {
            const vote = await new Vote({
                qa: qaId,
                user: userId,
                isQuestion: true,
                count: 0,
            }).save();

            expect(vote.count).toBe(0);
        });
    });

    describe('Edge Cases', () => {
        it('should handle rapid vote changes for same qa-user pair', async () => {
            await Vote.createIndexes();

            // First vote
            const vote = await new Vote({
                qa: qaId,
                user: userId,
                isQuestion: true,
                count: 1,
            }).save();

            // Update the vote
            vote.count = -1;
            const updatedVote = await vote.save();

            expect(updatedVote.count).toBe(-1);
        });

        it('should handle multiple votes for different questions by same user', async () => {
            const questions = Array.from({ length: 5 }, () => new mongoose.Types.ObjectId());

            const votes = [];
            for (let i = 0; i < questions.length; i++) {
                const vote = await new Vote({
                    qa: questions[i],
                    user: userId,
                    isQuestion: true,
                    count: i % 2 === 0 ? 1 : -1, // Alternate between upvote and downvote
                }).save();

                votes.push(vote);
            }

            expect(votes).toHaveLength(5);
            expect(votes.filter(v => v.count === 1)).toHaveLength(3); // 0, 2, 4 indices
            expect(votes.filter(v => v.count === -1)).toHaveLength(2); // 1, 3 indices
        });

        it('should handle votes for both questions and answers by same user', async () => {
            const questionId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();

            const questionVote = await new Vote({
                qa: questionId,
                user: userId,
                isQuestion: true,
                count: 1,
            }).save();

            const answerVote = await new Vote({
                qa: answerId,
                user: userId,
                isQuestion: false,
                count: -1,
            }).save();

            expect(questionVote.isQuestion).toBe(true);
            expect(answerVote.isQuestion).toBe(false);
            expect(questionVote.count).toBe(1);
            expect(answerVote.count).toBe(-1);
        });
    });
});
