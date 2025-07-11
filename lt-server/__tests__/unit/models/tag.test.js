const mongoose = require('mongoose');
const Tag = require('../../../src/models/tag');

describe('Tag Model Tests', () => {
    const chapterId = new mongoose.Types.ObjectId();

    it('should create a new tag successfully', async () => {
        const tagData = {
            name: 'javascript',
            chapter: chapterId,
        };

        const tag = new Tag(tagData);
        const savedTag = await tag.save();

        expect(savedTag._id).toBeDefined();
        expect(savedTag.name).toBe('Javascript');
        expect(savedTag.chapter.toString()).toBe(chapterId.toString());
    });

    it('should format multi-word tag names with hyphens', async () => {
        const tagData = {
            name: 'react hooks',
            chapter: chapterId,
        };

        const tag = new Tag(tagData);
        const savedTag = await tag.save();

        expect(savedTag.name).toBe('React-hooks');
    });

    it('should not allow duplicate tags for the same chapter', async () => {
        const tagData = {
            name: 'python',
            chapter: chapterId,
        };

        await new Tag(tagData).save();

        try {
            await new Tag(tagData).save();
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.name).toBe('MongoServerError');
            expect(error.code).toBe(11000);
        }
    });

    it('should allow same tag name for different chapters', async () => {
        const anotherChapterId = new mongoose.Types.ObjectId();

        const tagData1 = {
            name: 'algorithms',
            chapter: chapterId,
        };


        const tagData2 = {
            name: 'algorithms',
            chapter: anotherChapterId,
        };

        const tag1 = await new Tag(tagData1).save();
        const tag2 = await new Tag(tagData2).save();

        expect(tag1._id).toBeDefined();
        expect(tag2._id).toBeDefined();
        expect(tag1._id.toString()).not.toBe(tag2._id.toString());
    });

    it('should require name and chapter fields', async () => {
        const invalidTag = new Tag({});

        try {
            await invalidTag.save();
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.name).toBe('ValidationError');
            expect(error.errors.name).toBeDefined();
            expect(error.errors.chapter).toBeDefined();
        }
    });
});
