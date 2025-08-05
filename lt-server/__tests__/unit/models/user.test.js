const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../../../src/models/user');

describe('User Model Tests', () => {
    let classId;

    beforeEach(async () => {
        classId = new mongoose.Types.ObjectId();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    describe('Schema Validation', () => {
        it('should create a user with required fields', async () => {
            const userData = {
                userName: 'testuser',
                email: 'test@example.com',
                password: 'testpassword123',
            };

            const user = await new User(userData).save();

            expect(user.userName).toBe('testuser');
            expect(user.email).toBe('test@example.com');
            expect(user.password).not.toBe('testpassword123'); // Should be hashed
            expect(user.privileges).toEqual([]);
            expect(user.questions).toEqual([]);
            expect(user.answers).toEqual([]);
            expect(user.favourites).toEqual([]);
            expect(user.class).toBeUndefined();
        });

        it('should enforce required fields', async () => {
            const invalidUsers = [
                // Missing userName
                { email: 'test@example.com', password: 'testpassword123' },
                // Missing email
                { userName: 'testuser', password: 'testpassword123' },
                // Missing password
                { userName: 'testuser', email: 'test@example.com' },
                // All required fields missing
                {},
            ];

            for (const userData of invalidUsers) {
                const user = new User(userData);
                await expect(user.save()).rejects.toThrow();
            }
        });

        it('should enforce unique userName', async () => {
            const userData = {
                userName: 'uniqueuser',
                email: 'first@example.com',
                password: 'testpassword123',
            };

            await new User(userData).save();

            const duplicateUser = new User({
                userName: 'uniqueuser', // Same userName
                email: 'second@example.com',
                password: 'anotherpassword',
            });

            await expect(duplicateUser.save()).rejects.toThrow(/E11000|duplicate key/);
        });

        it('should enforce unique email', async () => {
            const userData = {
                userName: 'firstuser',
                email: 'unique@example.com',
                password: 'testpassword123',
            };

            await new User(userData).save();

            const duplicateUser = new User({
                userName: 'seconduser',
                email: 'unique@example.com', // Same email
                password: 'anotherpassword',
            });

            await expect(duplicateUser.save()).rejects.toThrow(/E11000|duplicate key/);
        });

        it('should store optional fields correctly', async () => {
            const privilegeIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
            const questionIds = [new mongoose.Types.ObjectId()];
            const answerIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
            const favouriteIds = [new mongoose.Types.ObjectId()];

            const user = await new User({
                userName: 'fulluser',
                email: 'full@example.com',
                password: 'testpassword123',
                privileges: privilegeIds,
                questions: questionIds,
                answers: answerIds,
                class: classId,
                favourites: favouriteIds,
            }).save();

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
            const user = await new User({
                userName: 'hashtest',
                email: 'hash@example.com',
                password: plainPassword,
            }).save();

            expect(user.password).not.toBe(plainPassword);
            expect(user.password).toMatch(/^\$2[ab]\$/); // bcrypt hash format
        });

        it('should not rehash password if not modified', async () => {
            const user = await new User({
                userName: 'noreHashTest',
                email: 'nohash@example.com',
                password: 'originalpassword',
            }).save();

            const originalHash = user.password;

            // Modify a different field
            user.userName = 'updatedusername';
            await user.save();

            expect(user.password).toBe(originalHash);
        });

        it('should rehash password when password is modified', async () => {
            const user = await new User({
                userName: 'rehashtest',
                email: 'rehash@example.com',
                password: 'originalpassword',
            }).save();

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

        it('should handle bcrypt errors gracefully', async () => {
            const user = new User({
                userName: 'errortest',
                email: 'error@example.com',
                password: 'invalidhash', // This will create an invalid hash
            });

            // Manually set an invalid hash to test error handling
            user.password = 'invalid-hash-format';

            const isMatch = await user.comparePassword('anypassword');
            expect(isMatch).toBe(false);
        });
    });


    describe('Edge Cases', () => {
        it('should handle very long usernames', async () => {
            const longUserName = 'a'.repeat(100); // Very long username
            
            const user = await new User({
                userName: longUserName,
                email: 'long@example.com',
                password: 'password123',
            }).save();

            expect(user.userName).toBe(longUserName);
        });

        it('should handle various email formats', async () => {
            const validEmails = [
                'user@domain.com',
                'user.name@domain.co.uk',
                'user+tag@domain.org',
                'user123@domain-name.info',
            ];

            for (let i = 0; i < validEmails.length; i++) {
                const user = await new User({
                    userName: `emailtest${i}`,
                    email: validEmails[i],
                    password: 'password123',
                }).save();

                expect(user.email).toBe(validEmails[i]);
            }
        });

        it('should handle special characters in userName', async () => {
            const specialUserNames = ['user_123', 'user-name', 'user.name', 'αβγδε'];

            for (let i = 0; i < specialUserNames.length; i++) {
                const user = await new User({
                    userName: specialUserNames[i],
                    email: `special${i}@example.com`,
                    password: 'password123',
                }).save();

                expect(user.userName).toBe(specialUserNames[i]);
            }
        });

        it('should handle empty arrays for reference fields', async () => {
            const user = await new User({
                userName: 'emptyarrays',
                email: 'empty@example.com',
                password: 'password123',
                privileges: [],
                questions: [],
                answers: [],
                favourites: [],
            }).save();

            expect(user.privileges).toEqual([]);
            expect(user.questions).toEqual([]);
            expect(user.answers).toEqual([]);
            expect(user.favourites).toEqual([]);
        });

        it('should handle maximum array sizes', async () => {
            const manyIds = Array.from({ length: 100 }, () => new mongoose.Types.ObjectId());

            const user = await new User({
                userName: 'manyrels',
                email: 'many@example.com',
                password: 'password123',
                privileges: manyIds.slice(0, 25),
                questions: manyIds.slice(25, 50),
                answers: manyIds.slice(50, 75),
                favourites: manyIds.slice(75, 100),
            }).save();

            expect(user.privileges).toHaveLength(25);
            expect(user.questions).toHaveLength(25);
            expect(user.answers).toHaveLength(25);
            expect(user.favourites).toHaveLength(25);
        });
    });
});
