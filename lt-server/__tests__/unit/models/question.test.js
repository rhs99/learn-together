const Question = require('../../../src/models/question');
const { createObjectId, clearCollection } = require('../../helpers');

describe('Question Model Tests', () => {
    let chapterId;

    beforeEach(async () => {
        chapterId = createObjectId();
    });

    afterEach(async () => {
        await clearCollection('questions');
    });

    describe('Schema Validation', () => {
        it('should create a question with required fields', async () => {
            const questionData = {
                details: { content: 'What is calculus?' },
                userName: 'testuser',
                chapter: chapterId,
            };

            const question = await new Question(questionData).save();

            expect(question.details.content).toBe('What is calculus?');
            expect(question.userName).toBe('testuser');
            expect(question.chapter.toString()).toBe(chapterId.toString());
            expect(question.upVote).toBe(0);
            expect(question.downVote).toBe(0);
            expect(question.tags).toEqual([]);
            expect(question.imageLocations).toEqual([]);
            expect(question.answers).toEqual([]);
        });

        it('should enforce required fields', async () => {
            const invalidQuestions = [
                { userName: 'testuser', chapter: chapterId },
                { details: { content: 'Test question' }, chapter: chapterId },
                { details: { content: 'Test question' }, userName: 'testuser' },
            ];

            for (const questionData of invalidQuestions) {
                const question = new Question(questionData);
                await expect(question.save()).rejects.toThrow();
            }
        });

        it('should accept mixed type details field', async () => {
            const detailsVariations = [
                { content: 'Simple string question' },
                { content: 'Question with formatting', bold: true },
                { html: '<p>HTML content</p>', plainText: 'HTML content' },
                'Simple string',
                ['Array', 'of', 'strings'],
            ];

            for (const details of detailsVariations) {
                const question = await new Question({
                    details,
                    userName: 'testuser',
                    chapter: chapterId,
                }).save();

                expect(question.details).toEqual(details);
            }
        });

        it('should store tags with _id and name', async () => {
            const tags = [
                { _id: createObjectId(), name: 'calculus' },
                { _id: createObjectId(), name: 'mathematics' },
            ];

            const question = await new Question({
                details: { content: 'Test question' },
                userName: 'testuser',
                chapter: chapterId,
                tags,
            }).save();

            expect(question.tags.length).toBe(2);
            expect(question.tags[0]._id.toString()).toBe(tags[0]._id.toString());
            expect(question.tags[0].name).toBe('calculus');
            expect(question.tags[1].name).toBe('mathematics');
        });

        it('should store image locations as strings', async () => {
            const imageLocations = ['image1.jpg', 'image2.png', 'image3.gif'];

            const question = await new Question({
                details: { content: 'Test question' },
                userName: 'testuser',
                chapter: chapterId,
                imageLocations,
            }).save();

            expect(question.imageLocations).toEqual(imageLocations);
        });

        it('should store answer references', async () => {
            const answerIds = [createObjectId(), createObjectId()];

            const question = await new Question({
                details: { content: 'Test question' },
                userName: 'testuser',
                chapter: chapterId,
                answers: answerIds,
            }).save();

            expect(question.answers.length).toBe(2);
            expect(question.answers.map((id) => id.toString())).toEqual(answerIds.map((id) => id.toString()));
        });
    });

    describe('Virtual Properties', () => {
        it('should calculate vote as upVote - downVote', async () => {
            const question = await new Question({
                details: { content: 'Test question' },
                userName: 'testuser',
                chapter: chapterId,
                upVote: 10,
                downVote: 3,
            }).save();

            const questionJSON = question.toJSON();
            expect(questionJSON.vote).toBe(7);
        });

        it('should handle zero votes correctly', async () => {
            const question = await new Question({
                details: { content: 'Test question' },
                userName: 'testuser',
                chapter: chapterId,
            }).save();

            const questionJSON = question.toJSON();
            expect(questionJSON.vote).toBe(0);
        });

        it('should handle negative vote counts', async () => {
            const question = await new Question({
                details: { content: 'Test question' },
                userName: 'testuser',
                chapter: chapterId,
                upVote: 2,
                downVote: 8,
            }).save();

            const questionJSON = question.toJSON();
            expect(questionJSON.vote).toBe(-6);
        });

        it('should include virtuals in JSON serialization', () => {
            const question = new Question({
                details: { content: 'Test question' },
                userName: 'testuser',
                chapter: chapterId,
                upVote: 5,
                downVote: 2,
            });

            const questionJSON = question.toJSON();
            expect(questionJSON.vote).toBe(3);
        });
    });

    describe('Timestamps', () => {
        it('should automatically add createdAt and updatedAt timestamps', async () => {
            const question = await new Question({
                details: { content: 'Test question' },
                userName: 'testuser',
                chapter: chapterId,
            }).save();

            expect(question.createdAt).toBeInstanceOf(Date);
            expect(question.updatedAt).toBeInstanceOf(Date);
        });

        it('should update updatedAt when document is modified', async () => {
            const question = await new Question({
                details: { content: 'Test question' },
                userName: 'testuser',
                chapter: chapterId,
            }).save();

            const originalUpdatedAt = question.updatedAt;

            await new Promise((resolve) => setTimeout(resolve, 10));

            question.upVote = 1;
            await question.save();

            expect(question.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        });
    });
});
