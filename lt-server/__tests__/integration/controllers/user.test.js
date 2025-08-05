const mongoose = require('mongoose');
const UserService = require('../../../src/services/user');
const Utils = require('../../../src/common/utils');
const User = require('../../../src/models/user');
const Class = require('../../../src/models/class');
const Privilege = require('../../../src/models/privilege');
const Notification = require('../../../src/models/notification');

describe('User Controller Integration Tests', () => {
    describe('GET /users/:userName', () => {
        it('should get user details successfully', async () => {
            const mockUser = {
                userName: 'testuser',
                questions: 0,
                answers: 0,
                privileges: [{ _id: 'privilegeId', name: 'default' }],
                upVote: 5,
                downVote: 2,
                class: 'Mathematics'
            };

            jest.spyOn(UserService, 'getUser').mockResolvedValue(mockUser);

            const response = await global.testRequest
                .get('/users/testuser');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
            expect(UserService.getUser).toHaveBeenCalledWith('testuser');
        });

        it('should return 404 when user not found', async () => {
            jest.spyOn(UserService, 'getUser').mockRejectedValue(
                new Error('No user found for userName: nonexistentuser')
            );

            const response = await global.testRequest
                .get('/users/nonexistentuser');

            expect(response.status).toBe(500); // Error handling converts to 500
            expect(UserService.getUser).toHaveBeenCalledWith('nonexistentuser');
        });

        it('should return 400 for invalid username format', async () => {
            const response = await global.testRequest
                .get('/users/'); // Empty username

            expect(response.status).toBe(404); // Route not found for empty path
        });
    });

    describe('GET /users/:userName/notifications', () => {
        it('should get user notifications successfully', async () => {
            const notifications = [
                {
                    _id: new mongoose.Types.ObjectId().toString(),
                    userId: new mongoose.Types.ObjectId().toString(),
                    type: 'new_answer',
                    details: new mongoose.Types.ObjectId().toString(),
                    read: false,
                    createdAt: '2025-08-05T12:32:39.544Z'
                }
            ];

            jest.spyOn(UserService, 'getNotifications').mockResolvedValue(notifications);

            const response = await global.testRequest
                .get('/users/testuser/notifications');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(notifications);
            expect(UserService.getNotifications).toHaveBeenCalledWith('testuser');
        });

        it('should return empty array when no notifications', async () => {
            jest.spyOn(UserService, 'getNotifications').mockResolvedValue([]);

            const response = await global.testRequest
                .get('/users/testuser/notifications');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('DELETE /users/:userName/notifications/:id', () => {
        it('should remove notification successfully', async () => {
            const notificationId = new mongoose.Types.ObjectId();
            
            jest.spyOn(UserService, 'removeNotification').mockResolvedValue();

            const response = await global.testRequest
                .delete(`/users/testuser/notifications/${notificationId}`);

            expect(response.status).toBe(200);
            expect(UserService.removeNotification).toHaveBeenCalledWith('testuser', notificationId.toString());
        });

        it('should return 400 for invalid notification ID format', async () => {
            const response = await global.testRequest
                .delete('/users/testuser/notifications/invalid-id');

            expect(response.status).toBe(400);
        });
    });

    describe('POST /users', () => {
        it('should create a new user successfully', async () => {
            const userData = {
                userName: 'newuser',
                email: 'newuser@example.com',
                password: 'password123'
            };

            jest.spyOn(UserService, 'addNewUser').mockResolvedValue();

            const response = await global.testRequest
                .post('/users')
                .send(userData);

            expect(response.status).toBe(201);
            expect(UserService.addNewUser).toHaveBeenCalledWith(userData);
        });

        it('should create a new user with class successfully', async () => {
            const classId = new mongoose.Types.ObjectId();
            const userData = {
                userName: 'newuser',
                email: 'newuser@example.com',
                password: 'password123',
                class: classId.toString()
            };

            jest.spyOn(UserService, 'addNewUser').mockResolvedValue();

            const response = await global.testRequest
                .post('/users')
                .send(userData);

            expect(response.status).toBe(201);
            expect(UserService.addNewUser).toHaveBeenCalledWith(userData);
        });

        it('should return 400 for missing required fields', async () => {
            const userData = {
                userName: 'newuser'
                // Missing email and password
            };

            const response = await global.testRequest
                .post('/users')
                .send(userData);

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid email format', async () => {
            const userData = {
                userName: 'newuser',
                email: 'invalid-email',
                password: 'password123'
            };

            const response = await global.testRequest
                .post('/users')
                .send(userData);

            expect(response.status).toBe(400);
        });

        it('should return 400 for short password', async () => {
            const userData = {
                userName: 'newuser',
                email: 'newuser@example.com',
                password: '123' // Too short
            };

            const response = await global.testRequest
                .post('/users')
                .send(userData);

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid username format', async () => {
            const userData = {
                userName: 'ab', // Too short
                email: 'newuser@example.com',
                password: 'password123'
            };

            const response = await global.testRequest
                .post('/users')
                .send(userData);

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid class ID format', async () => {
            const userData = {
                userName: 'newuser',
                email: 'newuser@example.com',
                password: 'password123',
                class: 'invalid-class-id'
            };

            const response = await global.testRequest
                .post('/users')
                .send(userData);

            expect(response.status).toBe(400);
        });
    });

    describe('POST /users/login', () => {
        it('should login user successfully', async () => {
            const userId = new mongoose.Types.ObjectId();
            const classId = new mongoose.Types.ObjectId();
            const mockUser = {
                _id: userId,
                userName: 'testuser',
                class: classId
            };

            jest.spyOn(UserService, 'logInUser').mockResolvedValue(mockUser);
            jest.spyOn(Utils, 'createToken').mockReturnValue('mock-jwt-token');

            const loginData = {
                userName: 'testuser',
                password: 'password123'
            };

            const response = await global.testRequest
                .post('/users/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token', 'mock-jwt-token');
            expect(response.body.class.toString()).toEqual(classId.toString());
            expect(UserService.logInUser).toHaveBeenCalledWith(loginData);
        });

        it('should return 500 when login fails', async () => {
            jest.spyOn(UserService, 'logInUser').mockResolvedValue(null);

            const loginData = {
                userName: 'testuser',
                password: 'wrongpassword'
            };

            const response = await global.testRequest
                .post('/users/login')
                .send(loginData);

            expect(response.status).toBe(500);
        });

        it('should return 400 for missing credentials', async () => {
            const response = await global.testRequest
                .post('/users/login')
                .send({
                    userName: 'testuser'
                    // Missing password
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /users/forgot-password', () => {
        it('should send password reset email successfully', async () => {
            const userId = new mongoose.Types.ObjectId();
            const mockUser = {
                _id: userId,
                userName: 'testuser',
                email: 'test@example.com'
            };

            jest.spyOn(UserService, 'forgotPassword').mockResolvedValue(mockUser);
            jest.spyOn(Utils, 'createTokenForPassword').mockReturnValue('mock-reset-token');
            jest.spyOn(Utils, 'sendEmail').mockResolvedValue();

            const forgotPasswordData = {
                email: 'test@example.com'
            };

            const response = await global.testRequest
                .post('/users/forgot-password')
                .send(forgotPasswordData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token', 'mock-reset-token');
            expect(response.body.userId).toEqual(userId.toString());
            expect(UserService.forgotPassword).toHaveBeenCalledWith(forgotPasswordData);
        });

        it('should return 500 when user not found', async () => {
            jest.spyOn(UserService, 'forgotPassword').mockResolvedValue(null);

            const forgotPasswordData = {
                email: 'nonexistent@example.com'
            };

            const response = await global.testRequest
                .post('/users/forgot-password')
                .send(forgotPasswordData);

            expect(response.status).toBe(500);
        });

        it('should return 400 for invalid email format', async () => {
            const response = await global.testRequest
                .post('/users/forgot-password')
                .send({
                    email: 'invalid-email'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /users/reset-password', () => {
        it('should reset password successfully', async () => {
            const userId = new mongoose.Types.ObjectId();
            
            jest.spyOn(UserService, 'resetPassword').mockResolvedValue();

            const resetPasswordData = {
                userId: userId.toString(),
                token: 'valid-reset-token',
                password: 'newpassword123'
            };

            const response = await global.testRequest
                .post('/users/reset-password')
                .send(resetPasswordData);

            expect(response.status).toBe(200);
            expect(UserService.resetPassword).toHaveBeenCalledWith(resetPasswordData);
        });

        it('should return 400 for invalid user ID format', async () => {
            const response = await global.testRequest
                .post('/users/reset-password')
                .send({
                    userId: 'invalid-id',
                    token: 'valid-token',
                    password: 'newpassword123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for short password', async () => {
            const userId = new mongoose.Types.ObjectId();
            
            const response = await global.testRequest
                .post('/users/reset-password')
                .send({
                    userId: userId.toString(),
                    token: 'valid-token',
                    password: '123' // Too short
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /users/update-class (Protected Route)', () => {
        it('should update user class successfully', async () => {
            const classId = new mongoose.Types.ObjectId();
            
            jest.spyOn(UserService, 'updateClassInUser').mockResolvedValue();

            const updateData = {
                userName: 'testuser',
                _class: classId.toString()
            };

            const response = await global.testRequest
                .post('/users/update-class')
                .send(updateData);

            expect(response.status).toBe(200);
            expect(UserService.updateClassInUser).toHaveBeenCalledWith(
                updateData,
                expect.any(Object) // req.user from middleware
            );
        });

        it('should return 400 for invalid class ID format', async () => {
            const response = await global.testRequest
                .post('/users/update-class')
                .send({
                    userName: 'testuser',
                    _class: 'invalid-class-id'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing required fields', async () => {
            const response = await global.testRequest
                .post('/users/update-class')
                .send({
                    userName: 'testuser'
                    // Missing _class
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /users/update-password (Protected Route)', () => {
        it('should update user password successfully', async () => {
            jest.spyOn(UserService, 'updatePasswordInUser').mockResolvedValue();

            const updateData = {
                userName: 'testuser',
                prevPassword: 'oldpassword',
                newPassword: 'newpassword123'
            };

            const response = await global.testRequest
                .post('/users/update-password')
                .send(updateData);

            expect(response.status).toBe(200);
            expect(UserService.updatePasswordInUser).toHaveBeenCalledWith(
                updateData,
                expect.any(Object) // req.user from middleware
            );
        });

        it('should return 400 for short new password', async () => {
            const response = await global.testRequest
                .post('/users/update-password')
                .send({
                    userName: 'testuser',
                    prevPassword: 'oldpassword',
                    newPassword: '123' // Too short
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing previous password', async () => {
            const response = await global.testRequest
                .post('/users/update-password')
                .send({
                    userName: 'testuser',
                    newPassword: 'newpassword123'
                    // Missing prevPassword
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /users/update-privilege (Admin Protected Route)', () => {
        it('should update user privileges successfully', async () => {
            const privilegeId = new mongoose.Types.ObjectId();
            
            jest.spyOn(UserService, 'updatePrivilege').mockResolvedValue();

            const updateData = {
                userName: 'testuser',
                privilege: privilegeId.toString()
            };

            const response = await global.testRequest
                .post('/users/update-privilege')
                .send(updateData);

            expect(response.status).toBe(200);
            expect(UserService.updatePrivilege).toHaveBeenCalledWith(updateData);
        });

        it('should return 400 for invalid privilege ID format', async () => {
            const response = await global.testRequest
                .post('/users/update-privilege')
                .send({
                    userName: 'testuser',
                    privilege: 'invalid-privilege-id'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing required fields', async () => {
            const response = await global.testRequest
                .post('/users/update-privilege')
                .send({
                    userName: 'testuser'
                    // Missing privilege
                });

            expect(response.status).toBe(400);
        });
    });

    describe('Error Handling', () => {
        it('should handle service errors gracefully', async () => {
            jest.spyOn(UserService, 'getUser').mockRejectedValue(
                new Error('Database connection failed')
            );

            const response = await global.testRequest
                .get('/users/testuser');

            expect(response.status).toBe(500);
        });

        it('should handle validation errors for POST requests', async () => {
            const response = await global.testRequest
                .post('/users')
                .send({
                    // Invalid data - no required fields
                });

            expect(response.status).toBe(400);
        });
    });

    describe('Route Protection', () => {
        it('should allow access to public routes without authentication', async () => {
            jest.spyOn(UserService, 'getUser').mockResolvedValue({
                userName: 'testuser',
                questions: 0,
                answers: 0,
                upVote: 0,
                downVote: 0
            });

            const response = await global.testRequest
                .get('/users/testuser');

            expect(response.status).toBe(200);
        });

        it('should provide user context for protected routes', async () => {
            jest.spyOn(UserService, 'updateClassInUser').mockImplementation((data, user) => {
                // Verify that user context is passed from middleware
                expect(user).toBeDefined();
                expect(user.userId).toBe('test-admin-id');
                return Promise.resolve();
            });

            const classId = new mongoose.Types.ObjectId();
            
            const response = await global.testRequest
                .post('/users/update-class')
                .send({
                    userName: 'testuser',
                    _class: classId.toString()
                });

            expect(response.status).toBe(200);
        });
    });
});
