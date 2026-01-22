const User = require('../../../src/models/user');
const { createUserData, createObjectId, clearCollection } = require('../../helpers');

describe('User Model Tests', () => {
    let classId;

    beforeEach(async () => {
        classId = createObjectId();
    });

    afterEach(async () => {
        await clearCollection('users');
    });

    describe('Schema Validation', () => {
        it('should create a user with required fields', async () => {
            const userData = createUserData({
                userName: 'testuser',
                email: 'test@example.com',
                password: 'testpassword123',
            });

            const user = await new User(userData).save();

            expect(user.userName).toBe('testuser');
            expect(user.email).toBe('test@example.com');
            expect(user.password).not.toBe('testpassword123');
            expect(user.privileges).toEqual([]);
            expect(user.questions).toEqual([]);
            expect(user.answers).toEqual([]);
            expect(user.favourites).toEqual([]);
            expect(user.class).toBeUndefined();
        });

        it('should enforce required fields', async () => {
            const invalidUsers = [
                { email: 'test@example.com', password: 'testpassword123' },
                { userName: 'testuser', password: 'testpassword123' },
                { userName: 'testuser', email: 'test@example.com' },
                {},
            ];

            for (const userData of invalidUsers) {
                const user = new User(userData);
                await expect(user.save()).rejects.toThrow();
            }
        });

        it('should enforce unique userName', async () => {
            const userData = createUserData({
                userName: 'uniqueuser',
                email: 'first@example.com',
            });

            await new User(userData).save();

            const duplicateUser = new User(
                createUserData({
                    userName: 'uniqueuser',
                    email: 'second@example.com',
                }),
            );

            await expect(duplicateUser.save()).rejects.toThrow(/E11000|duplicate key/);
        });

        it('should enforce unique email', async () => {
            const userData = createUserData({
                userName: 'firstuser',
                email: 'unique@example.com',
            });

            await new User(userData).save();

            const duplicateUser = new User(
                createUserData({
                    userName: 'seconduser',
                    email: 'unique@example.com',
                }),
            );

            await expect(duplicateUser.save()).rejects.toThrow(/E11000|duplicate key/);
        });

        it('should store optional fields correctly', async () => {
            const privilegeIds = [createObjectId(), createObjectId()];
            const questionIds = [createObjectId()];
            const answerIds = [createObjectId(), createObjectId()];
            const favouriteIds = [createObjectId()];

            const user = await new User(
                createUserData({
                    userName: 'fulluser',
                    email: 'full@example.com',
                    privileges: privilegeIds,
                    questions: questionIds,
                    answers: answerIds,
                    class: classId,
                    favourites: favouriteIds,
                }),
            ).save();

            expect(user.privileges.length).toBe(2);
            expect(user.questions.length).toBe(1);
            expect(user.answers.length).toBe(2);
            expect(user.class.toString()).toBe(classId.toString());
            expect(user.favourites.length).toBe(1);
        });
    });

    describe('Password Hashing', () => {
        it('should hash password before saving', async () => {
            const plainPassword = 'myplainpassword123';
            const user = await new User(
                createUserData({
                    userName: 'hashtest',
                    email: 'hash@example.com',
                    password: plainPassword,
                }),
            ).save();

            expect(user.password).not.toBe(plainPassword);
            expect(user.password).toMatch(/^\$2[ab]\$/);
        });

        it('should not rehash password if not modified', async () => {
            const user = await new User(
                createUserData({
                    userName: 'noreHashTest',
                    email: 'nohash@example.com',
                    password: 'originalpassword',
                }),
            ).save();

            const originalHash = user.password;

            user.userName = 'updatedusername';
            await user.save();

            expect(user.password).toBe(originalHash);
        });

        it('should rehash password when password is modified', async () => {
            const user = await new User(
                createUserData({
                    userName: 'rehashtest',
                    email: 'rehash@example.com',
                    password: 'originalpassword',
                }),
            ).save();

            const originalHash = user.password;

            user.password = 'newpassword123';
            await user.save();

            expect(user.password).not.toBe(originalHash);
            expect(user.password).toMatch(/^\$2[ab]\$/);
        });
    });

    describe('Password Comparison', () => {
        it('should correctly compare valid password', async () => {
            const plainPassword = 'correctpassword123';
            const user = await new User({
                userName: 'comparetest',
                email: 'compare@example.com',
                password: plainPassword,
            }).save();

            const isMatch = await user.comparePassword(plainPassword);
            expect(isMatch).toBe(true);
        });

        it('should correctly reject invalid password', async () => {
            const plainPassword = 'correctpassword123';
            const user = await new User({
                userName: 'rejecttest',
                email: 'reject@example.com',
                password: plainPassword,
            }).save();

            const isMatch = await user.comparePassword('wrongpassword');
            expect(isMatch).toBe(false);
        });

        it('should handle empty password comparison', async () => {
            const user = await new User({
                userName: 'emptytest',
                email: 'empty@example.com',
                password: 'realpassword123',
            }).save();

            const isMatch = await user.comparePassword('');
            expect(isMatch).toBe(false);
        });

        it('should handle null password comparison gracefully', async () => {
            const user = await new User({
                userName: 'nulltest',
                email: 'null@example.com',
                password: 'realpassword123',
            }).save();

            const isMatch = await user.comparePassword(null);
            expect(isMatch).toBe(false);
        });
    });
});
