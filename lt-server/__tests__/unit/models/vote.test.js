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
                count: -1,
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
                { user: userId, isQuestion: true, count: 1 },
                { qa: qaId, isQuestion: true, count: 1 },
                { qa: qaId, user: userId, count: 1 },
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
                { qa: 'invalid-id', user: userId, isQuestion: true, count: 1 },
                { qa: qaId, user: 'invalid-id', isQuestion: true, count: 1 },
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
    });

    describe('Unique Compound Index', () => {
        it('should enforce unique combination of qa and user', async () => {
            await Vote.createIndexes();

            const voteData = {
                qa: qaId,
                user: userId,
                isQuestion: true,
                count: 1,
            };

            await new Vote(voteData).save();

            const duplicateVote = new Vote({
                ...voteData,
                count: -1,
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
    });
});
