const mongoose = require('mongoose');
const Answer = require('../../../src/models/answer');

describe('Answer Model Tests', () => {
    let questionId;

    beforeEach(async () => {
        questionId = new mongoose.Types.ObjectId();
    });

    afterEach(async () => {
        await Answer.deleteMany({});
    });

    describe('Schema Validation', () => {
        it('should create an answer with required fields', async () => {
            const answerData = {
                userName: 'testuser',
                question: questionId,
            };

            const answer = await new Answer(answerData).save();

            expect(answer.userName).toBe('testuser');
            expect(answer.question.toString()).toBe(questionId.toString());
            expect(answer.upVote).toBe(0);
            expect(answer.downVote).toBe(0);
            expect(answer.imageLocations).toEqual([]);
            expect(answer.details).toBeUndefined();
        });

        it('should create an answer with optional details', async () => {
            const answerData = {
                details: { content: 'This is the answer explanation' },
                userName: 'testuser',
                question: questionId,
            };

            const answer = await new Answer(answerData).save();

            expect(answer.details.content).toBe('This is the answer explanation');
            expect(answer.userName).toBe('testuser');
            expect(answer.question.toString()).toBe(questionId.toString());
        });

        it('should enforce required fields', async () => {
            const invalidAnswers = [
                // Missing userName
                { details: { content: 'Test answer' }, question: questionId },
                // Missing question
                { details: { content: 'Test answer' }, userName: 'testuser' },
                // Both required fields missing
                { details: { content: 'Test answer' } },
            ];

            for (const answerData of invalidAnswers) {
                const answer = new Answer(answerData);
                await expect(answer.save()).rejects.toThrow();
            }
        });

        it('should accept mixed type details field', async () => {
            const detailsVariations = [
                { content: 'Simple string answer' },
                { content: 'Answer with formatting', bold: true, steps: ['Step 1', 'Step 2'] },
                { html: '<p>HTML content</p>', plainText: 'HTML content' },
                'Simple string',
                ['Array', 'of', 'answer', 'parts'],
                { formula: 'x = (-b ± √(b²-4ac)) / 2a', explanation: 'Quadratic formula' },
            ];

            for (const details of detailsVariations) {
                const answer = await new Answer({
                    details,
                    userName: 'testuser',
                    question: questionId,
                }).save();

                expect(answer.details).toEqual(details);
            }
        });

        it('should store image locations as strings', async () => {
            const imageLocations = ['solution1.jpg', 'diagram2.png', 'chart3.svg'];

            const answer = await new Answer({
                userName: 'testuser',
                question: questionId,
                imageLocations,
            }).save();

            expect(answer.imageLocations).toEqual(imageLocations);
        });

        it('should handle vote counts correctly', async () => {
            const answer = await new Answer({
                userName: 'testuser',
                question: questionId,
                upVote: 15,
                downVote: 3,
            }).save();

            expect(answer.upVote).toBe(15);
            expect(answer.downVote).toBe(3);
        });
    });

    describe('Virtual Properties', () => {
        it('should calculate vote as upVote - downVote', async () => {
            const answer = await new Answer({
                userName: 'testuser',
                question: questionId,
                upVote: 12,
                downVote: 4,
            }).save();

            const savedAnswer = await Answer.findById(answer._id);
            expect(savedAnswer.vote).toBe(8);
        });

        it('should handle zero votes correctly', async () => {
            const answer = await new Answer({
                userName: 'testuser',
                question: questionId,
            }).save();

            const savedAnswer = await Answer.findById(answer._id);
            expect(savedAnswer.vote).toBe(0);
        });

        it('should handle negative vote counts', async () => {
            const answer = await new Answer({
                userName: 'testuser',
                question: questionId,
                upVote: 1,
                downVote: 7,
            }).save();

            const savedAnswer = await Answer.findById(answer._id);
            expect(savedAnswer.vote).toBe(-6);
        });

        it('should include virtuals in JSON serialization', () => {
            const answer = new Answer({
                userName: 'testuser',
                question: questionId,
                upVote: 8,
                downVote: 3,
            });

            const answerJSON = answer.toJSON();
            expect(answerJSON.vote).toBe(5);
        });

        it('should include virtuals in object serialization', () => {
            const answer = new Answer({
                userName: 'testuser',
                question: questionId,
                upVote: 6,
                downVote: 2,
            });

            const answerObject = answer.toObject();
            expect(answerObject.vote).toBe(4);
        });
    });

    describe('Timestamps', () => {
        it('should automatically add createdAt and updatedAt timestamps', async () => {
            const answer = await new Answer({
                userName: 'testuser',
                question: questionId,
            }).save();

            expect(answer.createdAt).toBeInstanceOf(Date);
            expect(answer.updatedAt).toBeInstanceOf(Date);
        });

        it('should update updatedAt when document is modified', async () => {
            const answer = await new Answer({
                userName: 'testuser',
                question: questionId,
            }).save();

            const originalUpdatedAt = answer.updatedAt;

            // Wait a moment to ensure timestamp difference
            await new Promise((resolve) => setTimeout(resolve, 10));

            answer.upVote = 5;
            await answer.save();

            expect(answer.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        });
    });

    describe('Reference Validation', () => {
        it('should accept valid ObjectId for question reference', async () => {
            const validQuestionId = new mongoose.Types.ObjectId();

            const answer = await new Answer({
                userName: 'testuser',
                question: validQuestionId,
            }).save();

            expect(answer.question.toString()).toBe(validQuestionId.toString());
        });

        it('should reject invalid ObjectId format for question', async () => {
            const answer = new Answer({
                userName: 'testuser',
                question: 'invalid-object-id',
            });

            await expect(answer.save()).rejects.toThrow();
        });
    });

    describe('Edge Cases', () => {
        it('should handle very large vote counts', async () => {
            const answer = await new Answer({
                userName: 'testuser',
                question: questionId,
                upVote: Number.MAX_SAFE_INTEGER - 1,
                downVote: 1,
            }).save();

            const savedAnswer = await Answer.findById(answer._id);
            expect(savedAnswer.upVote).toBe(Number.MAX_SAFE_INTEGER - 1);
            expect(savedAnswer.vote).toBe(Number.MAX_SAFE_INTEGER - 2);
        });

        it('should handle empty arrays for optional fields', async () => {
            const answer = await new Answer({
                userName: 'testuser',
                question: questionId,
                imageLocations: [],
            }).save();

            expect(answer.imageLocations).toEqual([]);
        });

        it('should handle special characters in userName', async () => {
            const specialUserNames = ['user@domain.com', 'user-name_456', 'αβγδε', '答案用户'];

            for (const userName of specialUserNames) {
                const answer = await new Answer({
                    userName,
                    question: questionId,
                }).save();

                expect(answer.userName).toBe(userName);
            }
        });

        it('should handle null details field', async () => {
            const answer = await new Answer({
                details: null,
                userName: 'testuser',
                question: questionId,
            }).save();

            expect(answer.details).toBeNull();
        });

        it('should handle undefined details field', async () => {
            const answer = await new Answer({
                userName: 'testuser',
                question: questionId,
            }).save();

            expect(answer.details).toBeUndefined();
        });
    });

    describe('Model Relationships', () => {
        it('should reference the Question model correctly', () => {
            const answer = new Answer({
                userName: 'testuser',
                question: questionId,
            });

            expect(answer.schema.paths.question.options.ref).toBe('Question');
        });

        it('should store multiple image locations', async () => {
            const imageLocations = [
                'solutions/img1.jpg',
                'solutions/img2.png',
                'solutions/img3.gif',
                'solutions/img4.webp',
            ];

            const answer = await new Answer({
                userName: 'testuser',
                question: questionId,
                imageLocations,
            }).save();

            expect(answer.imageLocations).toHaveLength(4);
            expect(answer.imageLocations).toEqual(imageLocations);
        });
    });
});
