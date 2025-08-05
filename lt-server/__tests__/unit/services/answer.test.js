const mongoose = require('mongoose');
const Answer = require('../../../src/models/answer');
const Question = require('../../../src/models/question');
const User = require('../../../src/models/user');
const Notification = require('../../../src/models/notification');
const AnswerService = require('../../../src/services/answer');
const Utils = require('../../../src/common/utils');
const connectedUsers = require('../../../src/common/connected-users');
const { UnauthorizedError, NotFoundError } = require('../../../src/common/error');

// Mock connected users module
jest.mock('../../../src/common/connected-users', () => ({
    get: jest.fn(),
}));

describe('Answer Service Tests', () => {
    let getFileUrlSpy;
    
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        
        // Set up the getFileUrl spy for all tests
        getFileUrlSpy = jest.spyOn(Utils, 'getFileUrl');
        getFileUrlSpy.mockImplementation((fileName) => `https://play.min.io:9000/lt-bucket/${fileName}`);
    });
    
    afterEach(() => {
        // Clean up spies
        if (getFileUrlSpy) {
            getFileUrlSpy.mockRestore();
        }
    });
    
    describe('addNewAnswer', () => {
        it('should create a new answer when no _id is provided', async () => {
            // Mock data
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();
            
            const userData = {
                _id: userId,
                userName: 'testuser',
            };
            
            const questionData = {
                _id: questionId,
                userName: 'anotheruser',
            };
            
            const answerData = {
                details: 'Test answer details',
                question: questionId,
                user: userId,
                imageLocations: ['image1.jpg'],
            };
            
            // Setup mocks
            const findByIdMock = jest.spyOn(User, 'findById');
            findByIdMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(userData)
            }));
            
            const findQuestionMock = jest.spyOn(Question, 'findById');
            findQuestionMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(questionData)
            }));
            
            const saveMock = jest.fn().mockResolvedValue({
                ...answerData,
                _id: answerId,
                userName: 'testuser',
                save: jest.fn(),
            });
            
            const answerConstructorMock = jest.spyOn(Answer.prototype, 'save');
            answerConstructorMock.mockImplementation(saveMock);

            // Mock the update operations
            const findByIdAndUpdateUserMock = jest.spyOn(User, 'findByIdAndUpdate');
            findByIdAndUpdateUserMock.mockResolvedValue({});
            
            const findByIdAndUpdateQuestionMock = jest.spyOn(Question, 'findByIdAndUpdate');
            findByIdAndUpdateQuestionMock.mockResolvedValue({});
            
            // Mock notification creation
            const findOneUserMock = jest.spyOn(User, 'findOne');
            findOneUserMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue({
                    _id: new mongoose.Types.ObjectId(),
                    userName: 'anotheruser',
                })
            }));
            
            const saveMockNotification = jest.fn().mockResolvedValue({});
            const notificationConstructorMock = jest.spyOn(Notification.prototype, 'save');
            notificationConstructorMock.mockImplementation(saveMockNotification);
            
            // Execute the function
            const result = await AnswerService.addNewAnswer(answerData);
            
            // Assertions
            expect(findByIdMock).toHaveBeenCalledWith(userId);
            expect(findQuestionMock).toHaveBeenCalledWith(questionId);
            
            // Check if the answer was created properly
            expect(answerConstructorMock).toHaveBeenCalled();
            
            // Check if user and question were updated with the new answer
            expect(findByIdAndUpdateUserMock).toHaveBeenCalledWith(
                userId,
                { $push: { answers: expect.any(Object) } }
            );
            expect(findByIdAndUpdateQuestionMock).toHaveBeenCalledWith(
                questionId,
                { $push: { answers: expect.any(Object) } }
            );
            
            // Check if notification was created
            expect(notificationConstructorMock).toHaveBeenCalled();
            expect(saveMockNotification).toHaveBeenCalled();
            
            // Cleanup
            findByIdMock.mockRestore();
            findQuestionMock.mockRestore();
            answerConstructorMock.mockRestore();
            findByIdAndUpdateUserMock.mockRestore();
            findByIdAndUpdateQuestionMock.mockRestore();
            findOneUserMock.mockRestore();
            notificationConstructorMock.mockRestore();
        });

        it('should update an existing answer when _id is provided', async () => {
            // Mock data
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();
            
            const userData = {
                _id: userId,
                userName: 'testuser',
            };
            
            const questionData = {
                _id: questionId,
                userName: 'anotheruser',
            };
            
            const existingAnswer = {
                _id: answerId,
                details: 'Original answer',
                imageLocations: ['old-image.jpg'],
                userName: 'testuser',
                save: jest.fn().mockResolvedValue({
                    _id: answerId,
                    details: 'Updated answer',
                    imageLocations: ['new-image.jpg'],
                    userName: 'testuser',
                }),
            };
            
            const updateData = {
                _id: answerId,
                details: 'Updated answer',
                question: questionId,
                user: userId,
                imageLocations: ['new-image.jpg'],
            };
            
            // Setup mocks
            const findByIdMock = jest.spyOn(User, 'findById');
            findByIdMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(userData)
            }));
            
            const findQuestionMock = jest.spyOn(Question, 'findById');
            findQuestionMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(questionData)
            }));
            
            const findAnswerMock = jest.spyOn(Answer, 'findById');
            findAnswerMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(existingAnswer)
            }));
            
            // Mock notification creation
            const findOneUserMock = jest.spyOn(User, 'findOne');
            findOneUserMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue({
                    _id: new mongoose.Types.ObjectId(),
                    userName: 'anotheruser',
                })
            }));
            
            const saveMockNotification = jest.fn().mockResolvedValue({});
            const notificationConstructorMock = jest.spyOn(Notification.prototype, 'save');
            notificationConstructorMock.mockImplementation(saveMockNotification);
            
            // Execute the function
            const result = await AnswerService.addNewAnswer(updateData);
            
            // Assertions
            expect(findByIdMock).toHaveBeenCalledWith(userId);
            expect(findQuestionMock).toHaveBeenCalledWith(questionId);
            expect(findAnswerMock).toHaveBeenCalledWith(answerId);
            
            // Check if the answer was updated properly
            expect(existingAnswer.details).toBe('Updated answer');
            expect(existingAnswer.imageLocations).toEqual(['new-image.jpg']);
            expect(existingAnswer.save).toHaveBeenCalled();
            
            // Notification should be created
            expect(notificationConstructorMock).toHaveBeenCalled();
            
            // Cleanup
            findByIdMock.mockRestore();
            findQuestionMock.mockRestore();
            findAnswerMock.mockRestore();
            findOneUserMock.mockRestore();
            notificationConstructorMock.mockRestore();
        });

        it('should throw NotFoundError when user is not found', async () => {
            // Mock data
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();
            
            const answerData = {
                details: 'Test answer details',
                question: questionId,
                user: userId,
                imageLocations: ['image1.jpg'],
            };
            
            // Setup mocks
            const findByIdMock = jest.spyOn(User, 'findById');
            findByIdMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null)
            }));
            
            // Execute and assert
            await expect(AnswerService.addNewAnswer(answerData)).rejects.toThrow(
                NotFoundError
            );
            await expect(AnswerService.addNewAnswer(answerData)).rejects.toThrow(
                `User not found for id: ${userId}`
            );
            
            // Cleanup
            findByIdMock.mockRestore();
        });

        it('should throw NotFoundError when question is not found', async () => {
            // Mock data
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();
            
            const userData = {
                _id: userId,
                userName: 'testuser',
            };
            
            const answerData = {
                details: 'Test answer details',
                question: questionId,
                user: userId,
                imageLocations: ['image1.jpg'],
            };
            
            // Setup mocks
            const findByIdMock = jest.spyOn(User, 'findById');
            findByIdMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(userData)
            }));
            
            const findQuestionMock = jest.spyOn(Question, 'findById');
            findQuestionMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null)
            }));
            
            // Execute and assert
            await expect(AnswerService.addNewAnswer(answerData)).rejects.toThrow(
                NotFoundError
            );
            await expect(AnswerService.addNewAnswer(answerData)).rejects.toThrow(
                `Question not found for id: ${questionId}`
            );
            
            // Cleanup
            findByIdMock.mockRestore();
            findQuestionMock.mockRestore();
        });

        it('should throw UnauthorizedError when user tries to edit someone else\'s answer', async () => {
            // Mock data
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();
            
            const userData = {
                _id: userId,
                userName: 'testuser',
            };
            
            const questionData = {
                _id: questionId,
                userName: 'anotheruser',
            };
            
            const existingAnswer = {
                _id: answerId,
                details: 'Original answer',
                imageLocations: [],
                userName: 'differentuser', // Different from the user trying to edit
                save: jest.fn(),
            };
            
            const updateData = {
                _id: answerId,
                details: 'Updated answer',
                question: questionId,
                user: userId,
                imageLocations: [],
            };
            
            // Setup mocks
            const findByIdMock = jest.spyOn(User, 'findById');
            findByIdMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(userData)
            }));
            
            const findQuestionMock = jest.spyOn(Question, 'findById');
            findQuestionMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(questionData)
            }));
            
            const findAnswerMock = jest.spyOn(Answer, 'findById');
            findAnswerMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(existingAnswer)
            }));
            
            // Execute and assert
            await expect(AnswerService.addNewAnswer(updateData)).rejects.toThrow(
                UnauthorizedError
            );
            await expect(AnswerService.addNewAnswer(updateData)).rejects.toThrow(
                'Unauthorized: You can only edit your own answers'
            );
            
            // Cleanup
            findByIdMock.mockRestore();
            findQuestionMock.mockRestore();
            findAnswerMock.mockRestore();
        });
    });

    describe('getAnswer', () => {
        it('should return an answer with normalized image locations', async () => {
            // Mock data
            const answerId = new mongoose.Types.ObjectId();
            const answerData = {
                _id: answerId,
                details: 'Test answer details',
                userName: 'testuser',
                imageLocations: ['image1.jpg', 'image2.png'],
                toObject: jest.fn().mockReturnThis()
            };
            
            // Setup mocks
            const findByIdMock = jest.spyOn(Answer, 'findById');
            findByIdMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(answerData)
            }));
            
            // Execute
            const result = await AnswerService.getAnswer(answerId);
            
            // Assert
            expect(findByIdMock).toHaveBeenCalledWith(answerId);
            expect(result).toEqual(expect.objectContaining({
                details: 'Test answer details',
                userName: 'testuser',
                imageLocations: expect.arrayContaining([
                    'https://play.min.io:9000/lt-bucket/image1.jpg',
                    'https://play.min.io:9000/lt-bucket/image2.png'
                ])
            }));
            
            // Cleanup
            findByIdMock.mockRestore();
        });

        it('should throw NotFoundError when answer is not found', async () => {
            // Mock data
            const answerId = new mongoose.Types.ObjectId();
            
            // Setup mocks
            const findByIdMock = jest.spyOn(Answer, 'findById');
            findByIdMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null)
            }));
            
            // Execute and assert
            await expect(AnswerService.getAnswer(answerId)).rejects.toThrow(
                NotFoundError
            );
            await expect(AnswerService.getAnswer(answerId)).rejects.toThrow(
                `Answer not found for id: ${answerId}`
            );
            
            // Cleanup
            findByIdMock.mockRestore();
        });
    });

    describe('getAnswersByQuestion', () => {
        it('should return all answers for a question', async () => {
            // Mock data
            const questionId = new mongoose.Types.ObjectId();
            const answersData = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    details: 'Answer 1',
                    userName: 'user1',
                    question: questionId
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    details: 'Answer 2',
                    userName: 'user2',
                    question: questionId
                }
            ];
            
            // Setup mocks
            const findMock = jest.spyOn(Answer, 'find');
            findMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(answersData)
            }));
            
            // Execute
            const result = await AnswerService.getAnswersByQuestion(questionId);
            
            // Assert
            expect(findMock).toHaveBeenCalledWith({ question: questionId });
            expect(result).toHaveLength(2);
            expect(result).toEqual(expect.arrayContaining([
                expect.objectContaining({ details: 'Answer 1' }),
                expect.objectContaining({ details: 'Answer 2' })
            ]));
            
            // Cleanup
            findMock.mockRestore();
        });

        it('should return an empty array when no answers exist', async () => {
            // Mock data
            const questionId = new mongoose.Types.ObjectId();
            
            // Setup mocks
            const findMock = jest.spyOn(Answer, 'find');
            findMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue([])
            }));
            
            // Execute
            const result = await AnswerService.getAnswersByQuestion(questionId);
            
            // Assert
            expect(findMock).toHaveBeenCalledWith({ question: questionId });
            expect(result).toHaveLength(0);
            expect(result).toEqual([]);
            
            // Cleanup
            findMock.mockRestore();
        });

        it('should return empty array when an error occurs', async () => {
            // Mock data
            const questionId = new mongoose.Types.ObjectId();
            
            // Setup mocks
            const findMock = jest.spyOn(Answer, 'find');
            findMock.mockImplementation(() => ({
                exec: jest.fn().mockRejectedValue(new Error('Database error'))
            }));
            
            // Mock console.error
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            
            // Execute
            const result = await AnswerService.getAnswersByQuestion(questionId);
            
            // Assert
            expect(findMock).toHaveBeenCalledWith({ question: questionId });
            expect(result).toHaveLength(0);
            expect(result).toEqual([]);
            expect(consoleErrorSpy).toHaveBeenCalled();
            
            // Cleanup
            findMock.mockRestore();
            consoleErrorSpy.mockRestore();
        });
    });

    describe('getAllAnswers', () => {
        it('should return all answers for a question sorted by createdAt', async () => {
            // Mock data
            const questionId = new mongoose.Types.ObjectId();
            const answersData = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    details: 'Answer 1',
                    userName: 'user1',
                    question: questionId,
                    imageLocations: ['image1.jpg'],
                    createdAt: new Date('2023-08-02'),
                    toObject: jest.fn().mockReturnThis()
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    details: 'Answer 2',
                    userName: 'user2',
                    question: questionId,
                    imageLocations: ['image2.jpg', 'image3.jpg'],
                    createdAt: new Date('2023-08-01'),
                    toObject: jest.fn().mockReturnThis()
                }
            ];
            
            // Setup mocks
            const findMock = jest.spyOn(Answer, 'find');
            findMock.mockImplementation(() => ({
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(answersData)
            }));
            
            // Execute
            const result = await AnswerService.getAllAnswers(questionId);
            
            // Assert
            expect(findMock).toHaveBeenCalledWith({ question: questionId });
            expect(result).toHaveLength(2);
            expect(result).toEqual(expect.arrayContaining([
                expect.objectContaining({ 
                    details: 'Answer 1',
                    imageLocations: expect.arrayContaining(['https://play.min.io:9000/lt-bucket/image1.jpg'])
                }),
                expect.objectContaining({ 
                    details: 'Answer 2',
                    imageLocations: expect.arrayContaining([
                        'https://play.min.io:9000/lt-bucket/image2.jpg',
                        'https://play.min.io:9000/lt-bucket/image3.jpg'
                    ])
                })
            ]));
            
            // Cleanup
            findMock.mockRestore();
        });

        it('should throw an error when fetching answers fails', async () => {
            // Mock data
            const questionId = new mongoose.Types.ObjectId();
            
            // Setup mocks
            const findMock = jest.spyOn(Answer, 'find');
            findMock.mockImplementation(() => ({
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockRejectedValue(new Error('Database error'))
            }));
            
            // Execute and assert
            await expect(AnswerService.getAllAnswers(questionId)).rejects.toThrow(
                'Failed to fetch answers for question: Database error'
            );
            
            // Cleanup
            findMock.mockRestore();
        });
    });

    describe('deleteAnswer', () => {
        
        it('should delete an answer when user is the answer owner', async () => {
            // Mock data
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();
            
            const answerData = {
                _id: answerId,
                question: questionId,
                userName: 'testuser',
                imageLocations: ['image1.jpg', 'image2.jpg']
            };
            
            const questionData = {
                _id: questionId,
                userName: 'anotheruser'
            };
            
            const userData = {
                _id: userId,
                userName: 'testuser'
            };
            
            // Setup mocks
            const findAnswerMock = jest.spyOn(Answer, 'findById');
            findAnswerMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(answerData)
            }));
            
            const findQuestionMock = jest.spyOn(Question, 'findById');
            findQuestionMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(questionData)
            }));
            
            const findUserMock = jest.spyOn(User, 'findById');
            findUserMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(userData)
            }));
            
            const findByIdAndUpdateQuestionMock = jest.spyOn(Question, 'findByIdAndUpdate');
            findByIdAndUpdateQuestionMock.mockResolvedValue({});
            
            const findByIdAndUpdateUserMock = jest.spyOn(User, 'findByIdAndUpdate');
            findByIdAndUpdateUserMock.mockResolvedValue({});
            
            const deleteOneMock = jest.spyOn(Answer, 'deleteOne');
            deleteOneMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue({ deletedCount: 1 })
            }));
            
            // Create a spy for Utils.deleteFile
            const deleteFileSpy = jest.spyOn(Utils, 'deleteFile');
            deleteFileSpy.mockImplementation(() => {});
            
            // Execute the function
            await AnswerService.deleteAnswer(answerId, userId);
            
            // Assert
            expect(findAnswerMock).toHaveBeenCalledWith(answerId);
            expect(findQuestionMock).toHaveBeenCalledWith(questionId);
            expect(findUserMock).toHaveBeenCalledWith(userId);
            
            expect(findByIdAndUpdateQuestionMock).toHaveBeenCalledWith(
                questionId,
                { $pull: { answers: answerId } }
            );
            
            expect(findByIdAndUpdateUserMock).toHaveBeenCalledWith(
                userId,
                { $pull: { answers: answerId } }
            );
            
            expect(deleteOneMock).toHaveBeenCalledWith({ _id: answerId });
            
            // Check that deleteFile was called with the image locations
            expect(deleteFileSpy).toHaveBeenCalledWith(['image1.jpg', 'image2.jpg']);
            
            // Cleanup
            findAnswerMock.mockRestore();
            findQuestionMock.mockRestore();
            findUserMock.mockRestore();
            findByIdAndUpdateQuestionMock.mockRestore();
            findByIdAndUpdateUserMock.mockRestore();
            deleteOneMock.mockRestore();
            deleteFileSpy.mockRestore();
        });

        it('should delete an answer when user is the question owner', async () => {
            // Mock data
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();
            
            const answerData = {
                _id: answerId,
                question: questionId,
                userName: 'answerowner',
                imageLocations: ['image1.jpg']
            };
            
            const questionData = {
                _id: questionId,
                userName: 'testuser'
            };
            
            const userData = {
                _id: userId,
                userName: 'testuser'
            };
            
            // Setup mocks
            const findAnswerMock = jest.spyOn(Answer, 'findById');
            findAnswerMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(answerData)
            }));
            
            const findQuestionMock = jest.spyOn(Question, 'findById');
            findQuestionMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(questionData)
            }));
            
            const findUserMock = jest.spyOn(User, 'findById');
            findUserMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(userData)
            }));
            
            const findByIdAndUpdateQuestionMock = jest.spyOn(Question, 'findByIdAndUpdate');
            findByIdAndUpdateQuestionMock.mockResolvedValue({});
            
            const deleteOneMock = jest.spyOn(Answer, 'deleteOne');
            deleteOneMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue({ deletedCount: 1 })
            }));
            
            // Create a spy for Utils.deleteFile
            const deleteFileSpy = jest.spyOn(Utils, 'deleteFile');
            deleteFileSpy.mockImplementation(() => {});
            
            // Execute the function
            await AnswerService.deleteAnswer(answerId, userId);
            
            // Assert
            expect(findAnswerMock).toHaveBeenCalledWith(answerId);
            expect(findQuestionMock).toHaveBeenCalledWith(questionId);
            expect(findUserMock).toHaveBeenCalledWith(userId);
            
            expect(findByIdAndUpdateQuestionMock).toHaveBeenCalledWith(
                questionId,
                { $pull: { answers: answerId } }
            );
            
            // User's answers list should not be updated as they're not the answer owner
            expect(deleteOneMock).toHaveBeenCalledWith({ _id: answerId });
            
            // Check that deleteFile was called with the image locations
            expect(deleteFileSpy).toHaveBeenCalledWith(['image1.jpg']);
            
            // Cleanup
            findAnswerMock.mockRestore();
            findQuestionMock.mockRestore();
            findUserMock.mockRestore();
            findByIdAndUpdateQuestionMock.mockRestore();
            deleteOneMock.mockRestore();
            deleteFileSpy.mockRestore();
        });

        it('should throw UnauthorizedError when user is neither answer owner nor question owner', async () => {
            // Mock data
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();
            
            const answerData = {
                _id: answerId,
                question: questionId,
                userName: 'answerowner',
                imageLocations: []
            };
            
            const questionData = {
                _id: questionId,
                userName: 'questionowner'
            };
            
            const userData = {
                _id: userId,
                userName: 'testuser' // Different from both answer and question owner
            };
            
            // Setup mocks
            const findAnswerMock = jest.spyOn(Answer, 'findById');
            findAnswerMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(answerData)
            }));
            
            const findQuestionMock = jest.spyOn(Question, 'findById');
            findQuestionMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(questionData)
            }));
            
            const findUserMock = jest.spyOn(User, 'findById');
            findUserMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(userData)
            }));
            
            // Execute and assert
            await expect(AnswerService.deleteAnswer(answerId, userId)).rejects.toThrow(
                UnauthorizedError
            );
            await expect(AnswerService.deleteAnswer(answerId, userId)).rejects.toThrow(
                'Unauthorized: You can only delete your own answers or answers to your questions'
            );
            
            // Cleanup
            findAnswerMock.mockRestore();
            findQuestionMock.mockRestore();
            findUserMock.mockRestore();
        });

        it('should throw NotFoundError when answer is not found', async () => {
            // Mock data
            const userId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();
            
            // Setup mocks
            const findAnswerMock = jest.spyOn(Answer, 'findById');
            findAnswerMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null)
            }));
            
            // Execute and assert
            await expect(AnswerService.deleteAnswer(answerId, userId)).rejects.toThrow(
                NotFoundError
            );
            await expect(AnswerService.deleteAnswer(answerId, userId)).rejects.toThrow(
                `Answer not found for id: ${answerId}`
            );
            
            // Cleanup
            findAnswerMock.mockRestore();
        });

        it('should throw NotFoundError when question is not found', async () => {
            // Mock data
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();
            
            const answerData = {
                _id: answerId,
                question: questionId,
                userName: 'answerowner',
                imageLocations: []
            };
            
            // Setup mocks
            const findAnswerMock = jest.spyOn(Answer, 'findById');
            findAnswerMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(answerData)
            }));
            
            const findQuestionMock = jest.spyOn(Question, 'findById');
            findQuestionMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null)
            }));
            
            // Execute and assert
            await expect(AnswerService.deleteAnswer(answerId, userId)).rejects.toThrow(
                NotFoundError
            );
            await expect(AnswerService.deleteAnswer(answerId, userId)).rejects.toThrow(
                `Question not found for id: ${questionId}`
            );
            
            // Cleanup
            findAnswerMock.mockRestore();
            findQuestionMock.mockRestore();
        });

        it('should throw NotFoundError when user is not found', async () => {
            // Mock data
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();
            
            const answerData = {
                _id: answerId,
                question: questionId,
                userName: 'answerowner',
                imageLocations: []
            };
            
            const questionData = {
                _id: questionId,
                userName: 'questionowner'
            };
            
            // Setup mocks
            const findAnswerMock = jest.spyOn(Answer, 'findById');
            findAnswerMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(answerData)
            }));
            
            const findQuestionMock = jest.spyOn(Question, 'findById');
            findQuestionMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(questionData)
            }));
            
            const findUserMock = jest.spyOn(User, 'findById');
            findUserMock.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null)
            }));
            
            // Execute and assert
            await expect(AnswerService.deleteAnswer(answerId, userId)).rejects.toThrow(
                NotFoundError
            );
            await expect(AnswerService.deleteAnswer(answerId, userId)).rejects.toThrow(
                `User not found for id: ${userId}`
            );
            
            // Cleanup
            findAnswerMock.mockRestore();
            findQuestionMock.mockRestore();
            findUserMock.mockRestore();
        });
    });
});
