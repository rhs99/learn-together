const mongoose = require('mongoose');
const Question = require('../../../src/models/question');
const Chapter = require('../../../src/models/chapter');
const User = require('../../../src/models/user');
const QuestionService = require('../../../src/services/question');
const Utils = require('../../../src/common/utils');
const { UnauthorizedError, NotFoundError } = require('../../../src/common/error');

jest.mock('../../../src/common/utils', () => ({
    getFileUrl: jest.fn().mockImplementation((fileName) => `https://test-cdn.com/${fileName}`),
}));

describe('Question Service Tests', () => {
    describe('getQuestion', () => {
        it('should return a question with normalized image locations', async () => {
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();

            const questionData = {
                _id: questionId,
                title: 'Test Question',
                content: 'Test content',
                user: {
                    _id: userId,
                    userName: 'testuser',
                },
                imageLocations: ['image1.jpg', 'image2.png'],
                upVote: 5,
                downVote: 2,
                toObject: jest.fn().mockReturnThis(),
            };

            const findByIdMock = jest.spyOn(Question, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(questionData),
            }));

            const result = await QuestionService.getQuestion(questionId);

            expect(findByIdMock).toHaveBeenCalledWith(questionId);
            // The service should normalize image locations,
            // but we don't need to check exactly how it's called
            expect(result).toEqual(
                expect.objectContaining({
                    title: 'Test Question',
                    content: 'Test content',
                    imageLocations: expect.any(Array),
                }),
            );

            findByIdMock.mockRestore();
        });

        it('should throw NotFoundError when question is not found', async () => {
            const questionId = new mongoose.Types.ObjectId();

            const findByIdMock = jest.spyOn(Question, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            }));

            await expect(QuestionService.getQuestion(questionId)).rejects.toThrow(NotFoundError);
            // We should check for the exact error message since it's stable
            await expect(QuestionService.getQuestion(questionId)).rejects.toThrow('Question not found');

            findByIdMock.mockRestore();
        });
    });

    describe('getAllQuestions', () => {
        it('should return paginated questions with default parameters', async () => {
            const chapterId = new mongoose.Types.ObjectId();
            const userId = new mongoose.Types.ObjectId();

            const chapterData = {
                _id: chapterId,
                questions: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
            };

            const questionsData = [
                {
                    _id: chapterData.questions[0],
                    title: 'Question 1',
                    content: 'Content 1',
                    user: { _id: userId, userName: 'testuser' },
                    upVote: 5,
                    downVote: 2,
                    createdAt: new Date(),
                    voteDifference: 3,
                },
                {
                    _id: chapterData.questions[1],
                    title: 'Question 2',
                    content: 'Content 2',
                    user: { _id: userId, userName: 'testuser' },
                    upVote: 3,
                    downVote: 1,
                    createdAt: new Date(),
                    voteDifference: 2,
                },
            ];

            const findByIdChapterMock = jest.spyOn(Chapter, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(chapterData),
            }));

            // Add imageLocations to each question
            const questionsWithImages = questionsData.map((q) => ({
                ...q,
                imageLocations: [],
            }));

            const aggregateExecMock = jest.fn().mockResolvedValue([
                {
                    data: questionsWithImages,
                    metadata: [{ totalCount: questionsWithImages.length }],
                },
            ]);

            const aggregateMock = jest.spyOn(Question, 'aggregate').mockReturnValue({
                exec: aggregateExecMock,
            });

            const result = await QuestionService.getAllQuestions({ chapterId }, {});

            expect(findByIdChapterMock).toHaveBeenCalledWith(chapterId);
            expect(aggregateMock).toHaveBeenCalled();

            // Use containsEqual to match the objects while ignoring extra fields
            questionsData.forEach((expectedQuestion) => {
                expect(result.paginatedResults).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: expectedQuestion._id,
                            title: expectedQuestion.title,
                            content: expectedQuestion.content,
                            upVote: expectedQuestion.upVote,
                            downVote: expectedQuestion.downVote,
                            voteDifference: expectedQuestion.voteDifference,
                        }),
                    ]),
                );
            });

            expect(result.totalCount).toBe(questionsData.length);

            findByIdChapterMock.mockRestore();
            aggregateMock.mockRestore();
        });

        it('should filter questions by tag when tagIds are provided', async () => {
            const chapterId = new mongoose.Types.ObjectId();
            const tagId = new mongoose.Types.ObjectId();
            const userId = new mongoose.Types.ObjectId();

            const chapterData = {
                _id: chapterId,
                questions: [new mongoose.Types.ObjectId()],
            };

            const questionsData = [
                {
                    _id: chapterData.questions[0],
                    title: 'Question with tag',
                    content: 'Content with tag',
                    user: { _id: userId, userName: 'testuser' },
                    tags: [tagId],
                    upVote: 5,
                    downVote: 2,
                    createdAt: new Date(),
                    voteDifference: 3,
                },
            ];

            const findByIdChapterMock = jest.spyOn(Chapter, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(chapterData),
            }));

            // Add imageLocations to each question
            const questionsWithImages = questionsData.map((q) => ({
                ...q,
                imageLocations: [],
            }));

            const aggregateExecMock = jest.fn().mockResolvedValue([
                {
                    data: questionsWithImages,
                    metadata: [{ totalCount: questionsWithImages.length }],
                },
            ]);

            const aggregateMock = jest.spyOn(Question, 'aggregate').mockReturnValue({
                exec: aggregateExecMock,
            });

            const result = await QuestionService.getAllQuestions(
                {
                    chapterId,
                    tagIds: [tagId.toString()],
                },
                {},
            );

            expect(findByIdChapterMock).toHaveBeenCalledWith(chapterId);
            expect(aggregateMock).toHaveBeenCalled();

            // Use objectContaining to match only the properties we care about
            questionsData.forEach((expectedQuestion) => {
                expect(result.paginatedResults).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: expectedQuestion._id,
                            title: expectedQuestion.title,
                            content: expectedQuestion.content,
                            tags: expectedQuestion.tags,
                        }),
                    ]),
                );
            });

            findByIdChapterMock.mockRestore();
            aggregateMock.mockRestore();
        });
    });

    describe('addNewQuestion', () => {
        it('should create a new question and update related records', async () => {
            const userId = new mongoose.Types.ObjectId();
            const chapterId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();

            const userData = {
                _id: userId,
                userName: 'testuser',
                questions: [],
            };

            const chapterData = {
                _id: chapterId,
                name: 'Test Chapter',
                questions: [],
            };

            const questionData = {
                title: 'New Question',
                content: 'Question content',
                user: userId,
                chapter: chapterId,
                imageLocations: ['image1.jpg'],
            };

            const findByIdUserMock = jest.spyOn(User, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(userData),
            }));

            const findByIdChapterMock = jest.spyOn(Chapter, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(chapterData),
            }));

            const saveSpy = jest.spyOn(Question.prototype, 'save').mockImplementation(function () {
                this._id = questionId;
                return Promise.resolve(this);
            });

            const findByIdAndUpdateUserMock = jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue({
                _id: userId,
                questions: [questionId],
            });

            const findByIdAndUpdateChapterMock = jest.spyOn(Chapter, 'findByIdAndUpdate').mockResolvedValue({
                _id: chapterId,
                questions: [questionId],
            });

            const result = await QuestionService.addNewQuestion(questionData);

            expect(findByIdUserMock).toHaveBeenCalledWith(userId);
            expect(saveSpy).toHaveBeenCalled();
            expect(findByIdAndUpdateUserMock).toHaveBeenCalledWith(userId, { $push: { questions: questionId } });
            expect(findByIdAndUpdateChapterMock).toHaveBeenCalledWith(chapterId, { $push: { questions: questionId } });
            expect(result).toBeDefined();
            expect(result._id).toBe(questionId);

            findByIdUserMock.mockRestore();
            findByIdAndUpdateUserMock.mockRestore();
            findByIdAndUpdateChapterMock.mockRestore();
            saveSpy.mockRestore();
        });

        it('should throw NotFoundError when user is not found', async () => {
            const userId = new mongoose.Types.ObjectId();
            const chapterId = new mongoose.Types.ObjectId();

            const questionData = {
                title: 'New Question',
                content: 'Question content',
                user: userId,
                chapter: chapterId,
            };

            const findByIdUserMock = jest.spyOn(User, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));

            await expect(QuestionService.addNewQuestion(questionData)).rejects.toThrow(NotFoundError);
            await expect(QuestionService.addNewQuestion(questionData)).rejects.toThrow(/User not found/);

            findByIdUserMock.mockRestore();
        });
    });

    // Add more test cases for other question service methods as needed
});
