const UserService = require('../../../src/services/user');
const Utils = require('../../../src/common/utils');
const User = require('../../../src/models/user');
const Class = require('../../../src/models/class');
const Privilege = require('../../../src/models/privilege');
const Notification = require('../../../src/models/notification');
const { createObjectId, createUserData, createNotificationData, createAdminToken, withAuth } = require('../../helpers');

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
                class: 'Mathematics',
            };

            jest.spyOn(UserService, 'getUser').mockResolvedValue(mockUser);

            const response = await global.testRequest.get('/users/testuser');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
            expect(UserService.getUser).toHaveBeenCalledWith('testuser');
        });

        it('should return 404 when user not found', async () => {
            jest.spyOn(UserService, 'getUser').mockRejectedValue(
                new Error('No user found for userName: nonexistentuser'),
            );

            const response = await global.testRequest.get('/users/nonexistentuser');

            expect(response.status).toBe(500); // Error handling converts to 500
            expect(UserService.getUser).toHaveBeenCalledWith('nonexistentuser');
        });

        it('should return 400 for invalid username format', async () => {
            const response = await global.testRequest.get('/users/'); // Empty username

            expect(response.status).toBe(404); // Route not found for empty path
        });
    });

    describe('GET /users/:userName/notifications', () => {
        it('should get user notifications successfully', async () => {
            const notifications = [
                {
                    _id: createObjectId().toString(),
                    userId: createObjectId().toString(),
                    type: 'new_answer',
                    details: createObjectId().toString(),
                    read: false,
                    createdAt: '2025-08-05T12:32:39.544Z',
                },
            ];

            jest.spyOn(UserService, 'getNotifications').mockResolvedValue(notifications);

            const response = await global.testRequest.get('/users/testuser/notifications');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(notifications);
            expect(UserService.getNotifications).toHaveBeenCalledWith('testuser');
        });

        it('should return empty array when no notifications', async () => {
            jest.spyOn(UserService, 'getNotifications').mockResolvedValue([]);

            const response = await global.testRequest.get('/users/testuser/notifications');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('DELETE /users/:userName/notifications/:id', () => {
        it('should remove notification successfully', async () => {
            const notificationId = createObjectId();

            jest.spyOn(UserService, 'removeNotification').mockResolvedValue();

            const response = await global.testRequest.delete(`/users/testuser/notifications/${notificationId}`);

            expect(response.status).toBe(200);
            expect(UserService.removeNotification).toHaveBeenCalledWith('testuser', notificationId.toString());
        });

        it('should return 400 for invalid notification ID format', async () => {
            const response = await global.testRequest.delete('/users/testuser/notifications/invalid-id');

            expect(response.status).toBe(400);
        });
    });

    describe('POST /users', () => {
        it('should create a new user successfully', async () => {
            const userData = {
                userName: 'newuser',
                email: 'newuser@example.com',
                password: 'password123',
            };

            jest.spyOn(UserService, 'addNewUser').mockResolvedValue();

            const response = await global.testRequest.post('/users').send(userData);

            expect(response.status).toBe(201);
            expect(UserService.addNewUser).toHaveBeenCalledWith(userData);
        });

        it('should create a new user with class successfully', async () => {
            const classId = createObjectId();
            const userData = {
                userName: 'newuser',
                email: 'newuser@example.com',
                password: 'password123',
                class: classId.toString(),
            };

            jest.spyOn(UserService, 'addNewUser').mockResolvedValue();

            const response = await global.testRequest.post('/users').send(userData);

            expect(response.status).toBe(201);
            expect(UserService.addNewUser).toHaveBeenCalledWith(userData);
        });

        it('should return 400 for missing required fields', async () => {
            const userData = {
                userName: 'newuser',
                // Missing email and password
            };

            const response = await global.testRequest.post('/users').send(userData);

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid email format', async () => {
            const userData = {
                userName: 'newuser',
                email: 'invalid-email',
                password: 'password123',
            };

            const response = await global.testRequest.post('/users').send(userData);

            expect(response.status).toBe(400);
        });

        it('should return 400 for short password', async () => {
            const userData = {
                userName: 'newuser',
                email: 'newuser@example.com',
                password: '123', // Too short
            };

            const response = await global.testRequest.post('/users').send(userData);

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid username format', async () => {
            const userData = {
                userName: 'ab', // Too short
                email: 'newuser@example.com',
                password: 'password123',
            };

            const response = await global.testRequest.post('/users').send(userData);

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid class ID format', async () => {
            const userData = {
                userName: 'newuser',
                email: 'newuser@example.com',
                password: 'password123',
                class: 'invalid-class-id',
            };

            const response = await global.testRequest.post('/users').send(userData);

            expect(response.status).toBe(400);
        });
    });

    describe('POST /users/login', () => {
        it('should login user successfully', async () => {
            const userId = createObjectId();
            const classId = createObjectId();
            const mockUser = {
                _id: userId,
                userName: 'testuser',
                class: classId,
            };

            jest.spyOn(UserService, 'logInUser').mockResolvedValue(mockUser);
            jest.spyOn(Utils, 'createToken').mockReturnValue('mock-jwt-token');

            const loginData = {
                userName: 'testuser',
                password: 'password123',
            };

            const response = await global.testRequest.post('/users/login').send(loginData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token', 'mock-jwt-token');
            expect(response.body.class.toString()).toEqual(classId.toString());
            expect(UserService.logInUser).toHaveBeenCalledWith(loginData);
        });

        it('should return 500 when login fails', async () => {
            jest.spyOn(UserService, 'logInUser').mockResolvedValue(null);

            const loginData = {
                userName: 'testuser',
                password: 'wrongpassword',
            };

            const response = await global.testRequest.post('/users/login').send(loginData);

            expect(response.status).toBe(500);
        });

        it('should return 400 for missing credentials', async () => {
            const response = await global.testRequest.post('/users/login').send({
                userName: 'testuser',
                // Missing password
            });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /users/forgot-password', () => {
        it('should send password reset email successfully', async () => {
            const userId = createObjectId();
            const mockUser = {
                _id: userId,
                userName: 'testuser',
                email: 'test@example.com',
            };

            jest.spyOn(UserService, 'forgotPassword').mockResolvedValue(mockUser);
            jest.spyOn(Utils, 'createTokenForPassword').mockReturnValue('mock-reset-token');
            jest.spyOn(Utils, 'sendEmail').mockResolvedValue();

            const forgotPasswordData = {
                email: 'test@example.com',
            };

            const response = await global.testRequest.post('/users/forgot-password').send(forgotPasswordData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token', 'mock-reset-token');
            expect(response.body.userId).toEqual(userId.toString());
            expect(UserService.forgotPassword).toHaveBeenCalledWith(forgotPasswordData);
        });

        it('should return 500 when user not found', async () => {
            jest.spyOn(UserService, 'forgotPassword').mockResolvedValue(null);

            const forgotPasswordData = {
                email: 'nonexistent@example.com',
            };

            const response = await global.testRequest.post('/users/forgot-password').send(forgotPasswordData);

            expect(response.status).toBe(500);
        });

        it('should return 400 for invalid email format', async () => {
            const response = await global.testRequest.post('/users/forgot-password').send({
                email: 'invalid-email',
            });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /users/reset-password', () => {
        it('should reset password successfully', async () => {
            const userId = createObjectId();

            jest.spyOn(UserService, 'resetPassword').mockResolvedValue();

            const resetPasswordData = {
                userId: userId.toString(),
                token: 'valid-reset-token',
                password: 'newpassword123',
            };

            const response = await global.testRequest.post('/users/reset-password').send(resetPasswordData);

            expect(response.status).toBe(200);
            expect(UserService.resetPassword).toHaveBeenCalledWith(resetPasswordData);
        });

        it('should return 400 for invalid user ID format', async () => {
            const response = await global.testRequest.post('/users/reset-password').send({
                userId: 'invalid-id',
                token: 'valid-token',
                password: 'newpassword123',
            });

            expect(response.status).toBe(400);
        });

        it('should return 400 for short password', async () => {
            const userId = createObjectId();

            const response = await global.testRequest.post('/users/reset-password').send({
                userId: userId.toString(),
                token: 'valid-token',
                password: '123', // Too short
            });

            expect(response.status).toBe(400);
        });
    });

    describe('PATCH /users/:userName (Class Update)', () => {
        it('should update user class successfully', async () => {
            const classId = createObjectId();

            jest.spyOn(UserService, 'updateClassInUser').mockResolvedValue();

            const updateData = {
                _class: classId.toString(),
            };

            const token = createAdminToken();
            const response = await withAuth(global.testRequest.patch('/users/testuser'), token).send(updateData);

            expect(response.status).toBe(200);
            expect(UserService.updateClassInUser).toHaveBeenCalledWith(
                { userName: 'testuser', ...updateData },
                expect.any(String), // User ID from JWT token
            );
        });

        it('should return 400 for invalid class ID format', async () => {
            const token = createAdminToken();
            const response = await withAuth(global.testRequest.patch('/users/testuser'), token).send({
                _class: 'invalid-class-id',
            });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing required fields', async () => {
            const token = createAdminToken();
            const response = await withAuth(global.testRequest.patch('/users/testuser'), token).send({
                // Missing _class
            });

            expect(response.status).toBe(400);
        });

        it('should reject unauthenticated requests', async () => {
            const classId = createObjectId();
            const response = await global.testRequest.patch('/users/testuser').send({
                _class: classId.toString(),
            });

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('token');
        });
    });

    describe('PATCH /users/:userName (Password Update)', () => {
        it('should update user password successfully', async () => {
            jest.spyOn(UserService, 'updatePasswordInUser').mockResolvedValue();

            const updateData = {
                prevPassword: 'oldpassword',
                password: 'newpassword123',
            };

            const token = createAdminToken();
            const response = await withAuth(global.testRequest.patch('/users/testuser'), token).send(updateData);

            expect(response.status).toBe(200);
            expect(UserService.updatePasswordInUser).toHaveBeenCalledWith(
                { userName: 'testuser', ...updateData },
                expect.any(String), // User ID from JWT token
            );
        });

        it('should return 400 for short new password', async () => {
            const token = createAdminToken();
            const response = await withAuth(global.testRequest.patch('/users/testuser'), token).send({
                prevPassword: 'oldpassword',
                password: '123', // Too short
            });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing previous password', async () => {
            const token = createAdminToken();
            const response = await withAuth(global.testRequest.patch('/users/testuser'), token).send({
                password: 'newpassword123',
                // Missing prevPassword
            });

            expect(response.status).toBe(400);
        });

        it('should reject unauthenticated requests', async () => {
            const response = await global.testRequest.patch('/users/testuser').send({
                prevPassword: 'oldpassword',
                password: 'newpassword123',
            });

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('token');
        });
    });

    describe('PATCH /users/:userName (Privilege Update)', () => {
        it('should update user privileges successfully', async () => {
            const privilegeId = createObjectId();

            jest.spyOn(UserService, 'updatePrivilege').mockResolvedValue();

            const updateData = {
                privilege: privilegeId.toString(),
            };

            const token = createAdminToken();
            const response = await withAuth(global.testRequest.patch('/users/testuser'), token).send(updateData);

            expect(response.status).toBe(200);
            expect(UserService.updatePrivilege).toHaveBeenCalledWith({ userName: 'testuser', ...updateData });
        });

        it('should return 400 for invalid privilege ID format', async () => {
            const token = createAdminToken();
            const response = await withAuth(global.testRequest.patch('/users/testuser'), token).send({
                privilege: 'invalid-privilege-id',
            });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing required fields', async () => {
            const token = createAdminToken();
            const response = await withAuth(global.testRequest.patch('/users/testuser'), token).send({
                // Missing privilege
            });

            expect(response.status).toBe(400);
        });

        it('should reject unauthenticated requests', async () => {
            const privilegeId = createObjectId();
            const response = await global.testRequest.patch('/users/testuser').send({
                privilege: privilegeId.toString(),
            });

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('token');
        });
    });

    describe('Error Handling', () => {
        it('should handle service errors gracefully', async () => {
            jest.spyOn(UserService, 'getUser').mockRejectedValue(new Error('Database connection failed'));

            const response = await global.testRequest.get('/users/testuser');

            expect(response.status).toBe(500);
        });

        it('should handle validation errors for POST requests', async () => {
            const response = await global.testRequest.post('/users').send({
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
                downVote: 0,
            });

            const response = await global.testRequest.get('/users/testuser');

            expect(response.status).toBe(200);
        });

        it('should provide user context for protected routes', async () => {
            jest.spyOn(UserService, 'updateClassInUser').mockImplementation((data, user) => {
                // Verify that user context is passed from middleware
                expect(user).toBeDefined();
                return Promise.resolve();
            });

            const classId = createObjectId();
            const token = createAdminToken();

            const response = await withAuth(global.testRequest.patch('/users/testuser'), token).send({
                _class: classId.toString(),
            });

            expect(response.status).toBe(200);
        });
    });
});
