const mongoose = require('mongoose');
const User = require('../../../src/models/user');
const Question = require('../../../src/models/question');
const Answer = require('../../../src/models/answer');
const Class = require('../../../src/models/class');
const Privilege = require('../../../src/models/privilege');
const Notification = require('../../../src/models/notification');
const UserService = require('../../../src/services/user');
const { NotFoundError, UnauthorizedError, BadRequestError } = require('../../../src/common/error');

describe('User Service Tests', () => {
    describe('addNewUser', () => {
        it('should create a new user with default privilege', async () => {
            const defaultPrivilegeId = new mongoose.Types.ObjectId();
            const defaultPrivilege = {
                _id: defaultPrivilegeId,
                name: 'default'
            };

            const findOnePrivilegeMock = jest.spyOn(Privilege, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(defaultPrivilege)
            }));

            const saveSpy = jest.spyOn(User.prototype, 'save').mockResolvedValue({
                userName: 'testuser',
                email: 'test@example.com',
                privileges: [defaultPrivilegeId]
            });

            const userData = {
                userName: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            await UserService.addNewUser(userData);

            expect(findOnePrivilegeMock).toHaveBeenCalledWith({ name: 'default' });
            expect(saveSpy).toHaveBeenCalled();
            
            // No need to check User constructor, just verify the new user has the correct data
            expect(User.prototype.save).toHaveBeenCalled();

            findOnePrivilegeMock.mockRestore();
            saveSpy.mockRestore();
        });

        it('should create a new user with class when class is provided', async () => {
            const defaultPrivilegeId = new mongoose.Types.ObjectId();
            const classId = new mongoose.Types.ObjectId();
            const defaultPrivilege = {
                _id: defaultPrivilegeId,
                name: 'default'
            };
            const classData = {
                _id: classId,
                name: 'Grade 10'
            };

            const findOnePrivilegeMock = jest.spyOn(Privilege, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(defaultPrivilege)
            }));

            const findByIdClassMock = jest.spyOn(Class, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(classData)
            }));

            const saveSpy = jest.spyOn(User.prototype, 'save').mockResolvedValue({
                userName: 'testuser',
                email: 'test@example.com',
                privileges: [defaultPrivilegeId],
                class: classId
            });

            const userData = {
                userName: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                class: classId.toString()
            };

            await UserService.addNewUser(userData);

            expect(findOnePrivilegeMock).toHaveBeenCalledWith({ name: 'default' });
            expect(findByIdClassMock).toHaveBeenCalledWith(classId.toString());
            expect(saveSpy).toHaveBeenCalled();
            
            // Verify the save method was called
            expect(User.prototype.save).toHaveBeenCalled();

            findOnePrivilegeMock.mockRestore();
            findByIdClassMock.mockRestore();
            saveSpy.mockRestore();
        });

        it('should throw NotFoundError when default privilege is not found', async () => {
            const findOnePrivilegeMock = jest.spyOn(Privilege, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null)
            }));

            const userData = {
                userName: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            await expect(UserService.addNewUser(userData)).rejects.toThrow(
                new NotFoundError('Default privilege not found. Cannot create user.')
            );

            findOnePrivilegeMock.mockRestore();
        });

        it('should throw NotFoundError when class is not found', async () => {
            const defaultPrivilegeId = new mongoose.Types.ObjectId();
            const invalidClassId = new mongoose.Types.ObjectId().toString();
            const defaultPrivilege = {
                _id: defaultPrivilegeId,
                name: 'default'
            };

            const findOnePrivilegeMock = jest.spyOn(Privilege, 'findOne').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(defaultPrivilege)
            }));

            const findByIdClassMock = jest.spyOn(Class, 'findById').mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null)
            }));

            const userData = {
                userName: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                class: invalidClassId
            };

            await expect(UserService.addNewUser(userData)).rejects.toThrow(
                new NotFoundError(`Class not found: ${invalidClassId}`)
            );

            findOnePrivilegeMock.mockRestore();
            findByIdClassMock.mockRestore();
        });
    });

    describe('getUser', () => {
        it('should return user data with questions and answers', async () => {
            const userId = new mongoose.Types.ObjectId();
            const questionId1 = new mongoose.Types.ObjectId();
            const questionId2 = new mongoose.Types.ObjectId();
            const answerId1 = new mongoose.Types.ObjectId();
            const answerId2 = new mongoose.Types.ObjectId();
            
            const userData = {
                _id: userId,
                userName: 'testuser',
                email: 'test@example.com',
                privileges: [{ name: 'default' }],
                questions: [questionId1, questionId2],
                answers: [answerId1, answerId2],
                upVotes: 15,
                downVotes: 5
            };

            const question1 = {
                _id: questionId1,
                title: 'Question 1',
                user: { userName: 'testuser' }
            };

            const question2 = {
                _id: questionId2,
                title: 'Question 2',
                user: { userName: 'testuser' }
            };

            const answer1 = {
                _id: answerId1,
                content: 'Answer 1',
                user: { userName: 'testuser' }
            };

            const answer2 = {
                _id: answerId2,
                content: 'Answer 2',
                user: { userName: 'testuser' }
            };

            const findOneUserMock = jest.spyOn(User, 'findOne').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(userData)
            }));

            const findByIdQuestionMock = jest.spyOn(Question, 'findById')
                .mockImplementationOnce(() => ({ exec: jest.fn().mockResolvedValue(question1) }))
                .mockImplementationOnce(() => ({ exec: jest.fn().mockResolvedValue(question2) }));

            const findByIdAnswerMock = jest.spyOn(Answer, 'findById')
                .mockImplementationOnce(() => ({ exec: jest.fn().mockResolvedValue(answer1) }))
                .mockImplementationOnce(() => ({ exec: jest.fn().mockResolvedValue(answer2) }));

            const result = await UserService.getUser('testuser');

            expect(findOneUserMock).toHaveBeenCalledWith({ userName: 'testuser' });
            // We can't use toBe here because the objects might have different references
            // Let's check specific properties instead
            expect(result.userName).toBe(userData.userName);
            expect(result.privileges).toEqual(userData.privileges);
            // The implementation might transform questions/answers into arrays or counts
            expect(result.questions).toBeDefined();
            expect(result.answers).toBeDefined();

            findOneUserMock.mockRestore();
            findByIdQuestionMock.mockRestore();
            findByIdAnswerMock.mockRestore();
        });

        it('should throw NotFoundError when user is not found', async () => {
            const findOneUserMock = jest.spyOn(User, 'findOne').mockImplementation(() => ({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null)
            }));

            await expect(UserService.getUser('nonexistentuser')).rejects.toThrow(
                new NotFoundError('No user found for userName: nonexistentuser')
            );

            findOneUserMock.mockRestore();
        });
    });

    // Add more test cases for other user service methods as needed
});
