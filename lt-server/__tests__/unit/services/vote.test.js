const mongoose = require('mongoose');
const Vote = require('../../../src/models/vote');
const Question = require('../../../src/models/question');
const Answer = require('../../../src/models/answer');
const VoteService = require('../../../src/services/vote');
const { NotFoundError } = require('../../../src/common/error');

describe('Vote Service Tests', () => {
    describe('updateVote', () => {
        it('should add upvote to a question when vote does not exist', async () => {
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();

            const questionData = {
                _id: questionId,
                title: 'Test Question',
                content: 'Question content',
                upVote: 5,
                downVote: 2,
                save: jest.fn().mockResolvedValue({
                    _id: questionId,
                    upVote: 6,
                    downVote: 2,
                }),
            };

            const voteData = {
                qaId: questionId,
                user: userId,
                q: true,
                up: true,
            };

            // No existing vote
            const findOneVoteMock = jest.spyOn(Vote, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));

            const findOneQuestionMock = jest.spyOn(Question, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(questionData),
            }));

            const voteSaveSpy = jest.spyOn(Vote.prototype, 'save').mockImplementation(function () {
                return Promise.resolve(this);
            });

            const result = await VoteService.updateVote(voteData);

            expect(findOneVoteMock).toHaveBeenCalledWith({
                qa: questionId,
                user: userId,
                isQuestion: true,
            });
            expect(findOneQuestionMock).toHaveBeenCalledWith({ _id: questionId });
            expect(voteSaveSpy).toHaveBeenCalled();
            expect(questionData.save).toHaveBeenCalled();
            expect(questionData.upVote).toBe(6);
            expect(result).toEqual({ upVote: 6, downVote: 2 });

            findOneVoteMock.mockRestore();
            findOneQuestionMock.mockRestore();
            voteSaveSpy.mockRestore();
        });

        it('should add downvote to an answer when vote does not exist', async () => {
            const userId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();

            const answerData = {
                _id: answerId,
                content: 'Test Answer',
                upVote: 3,
                downVote: 1,
                save: jest.fn().mockResolvedValue({
                    _id: answerId,
                    upVote: 3,
                    downVote: 2,
                }),
            };

            const voteData = {
                qaId: answerId,
                user: userId,
                q: false,
                up: false,
            };

            // No existing vote
            const findOneVoteMock = jest.spyOn(Vote, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));

            const findOneAnswerMock = jest.spyOn(Answer, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(answerData),
            }));

            const voteSaveSpy = jest.spyOn(Vote.prototype, 'save').mockImplementation(function () {
                return Promise.resolve(this);
            });

            const result = await VoteService.updateVote(voteData);

            expect(findOneVoteMock).toHaveBeenCalledWith({
                qa: answerId,
                user: userId,
                isQuestion: false,
            });
            expect(findOneAnswerMock).toHaveBeenCalledWith({ _id: answerId });
            expect(voteSaveSpy).toHaveBeenCalled();
            expect(answerData.save).toHaveBeenCalled();
            expect(answerData.downVote).toBe(2);
            expect(result).toEqual({ upVote: 3, downVote: 2 });

            findOneVoteMock.mockRestore();
            findOneAnswerMock.mockRestore();
            voteSaveSpy.mockRestore();
        });

        it('should change vote from downvote to upvote', async () => {
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();

            const questionData = {
                _id: questionId,
                title: 'Test Question',
                content: 'Question content',
                upVote: 5,
                downVote: 2,
                save: jest.fn().mockResolvedValue({
                    _id: questionId,
                    upVote: 6,
                    downVote: 1,
                }),
            };

            const existingVote = {
                qa: questionId,
                user: userId,
                isQuestion: true,
                count: -1,
                save: jest.fn().mockImplementation(function () {
                    this.count = 1;
                    return Promise.resolve(this);
                }),
            };

            const voteData = {
                qaId: questionId,
                user: userId,
                q: true,
                up: true,
            };

            const findOneVoteMock = jest.spyOn(Vote, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(existingVote),
            }));

            const findOneQuestionMock = jest.spyOn(Question, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(questionData),
            }));

            const result = await VoteService.updateVote(voteData);

            expect(findOneVoteMock).toHaveBeenCalledWith({
                qa: questionId,
                user: userId,
                isQuestion: true,
            });
            expect(findOneQuestionMock).toHaveBeenCalledWith({ _id: questionId });
            expect(existingVote.save).toHaveBeenCalled();
            expect(questionData.save).toHaveBeenCalled();
            // After saving, the values come from the saved result
            expect(result.upVote).toBe(6);
            expect(result.downVote).toBe(1);
            expect(result).toEqual({ upVote: 6, downVote: 1 });

            findOneVoteMock.mockRestore();
            findOneQuestionMock.mockRestore();
        });

        it('should throw NotFoundError when question/answer is not found', async () => {
            const userId = new mongoose.Types.ObjectId();
            const questionId = new mongoose.Types.ObjectId();

            const voteData = {
                qaId: questionId,
                user: userId,
                q: true,
                up: true,
            };

            const findOneVoteMock = jest.spyOn(Vote, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));

            const findOneQuestionMock = jest.spyOn(Question, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));

            await expect(VoteService.updateVote(voteData)).rejects.toThrow(
                new NotFoundError(`Question not found for id: ${questionId}`),
            );

            findOneVoteMock.mockRestore();
            findOneQuestionMock.mockRestore();
        });

        it('should not change vote count when voting the same way', async () => {
            const userId = new mongoose.Types.ObjectId();
            const answerId = new mongoose.Types.ObjectId();

            const answerData = {
                _id: answerId,
                content: 'Test Answer',
                upVote: 3,
                downVote: 1,
                save: jest.fn().mockResolvedValue({
                    _id: answerId,
                    upVote: 3,
                    downVote: 1,
                }),
            };

            const existingVote = {
                qa: answerId,
                user: userId,
                isQuestion: false,
                count: 1, // Already upvoted
                save: jest.fn().mockResolvedValue({
                    qa: answerId,
                    user: userId,
                    isQuestion: false,
                    count: 1,
                }),
            };

            const voteData = {
                qaId: answerId,
                user: userId,
                q: false,
                up: true, // Upvote again
            };

            const findOneVoteMock = jest.spyOn(Vote, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(existingVote),
            }));

            const findOneAnswerMock = jest.spyOn(Answer, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(answerData),
            }));

            const result = await VoteService.updateVote(voteData);

            expect(findOneVoteMock).toHaveBeenCalledWith({
                qa: answerId,
                user: userId,
                isQuestion: false,
            });
            expect(findOneAnswerMock).toHaveBeenCalledWith({ _id: answerId });
            expect(existingVote.save).toHaveBeenCalled();
            expect(answerData.save).toHaveBeenCalled();

            // Vote counts shouldn't change
            expect(answerData.upVote).toBe(3);
            expect(answerData.downVote).toBe(1);
            expect(result).toEqual({ upVote: 3, downVote: 1 });

            findOneVoteMock.mockRestore();
            findOneAnswerMock.mockRestore();
        });
    });
});
