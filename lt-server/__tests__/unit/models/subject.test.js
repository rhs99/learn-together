const mongoose = require('mongoose');
const Subject = require('../../../src/models/subject');

describe('Subject Model Tests', () => {
    let classId;

    beforeEach(async () => {
        classId = new mongoose.Types.ObjectId();
    });

    afterEach(async () => {
        await Subject.deleteMany({});
    });

    it('should create a subject with and without chapters', async () => {
        const basicSubject = await new Subject({
            name: 'Mathematics',
            class: classId,
        }).save();

        expect(basicSubject.name).toBe('Mathematics');
        expect(basicSubject.class.toString()).toBe(classId.toString());
        expect(basicSubject.chapters).toEqual([]);

        const chapters = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
        const subjectWithChapters = await new Subject({
            name: 'Physics',
            class: classId,
            chapters,
        }).save();

        expect(subjectWithChapters.name).toBe('Physics');
        expect(subjectWithChapters.chapters.length).toBe(2);
        expect(subjectWithChapters.chapters.map((id) => id.toString())).toEqual(chapters.map((id) => id.toString()));
    });

    it('should enforce required fields at model level', async () => {
        const subjectWithoutName = new Subject({ class: classId });
        await expect(subjectWithoutName.save()).rejects.toThrow();
    });

    it('should enforce unique compound index on name and class', async () => {
        // Ensure index is created before testing unique constraint
        await Subject.createIndexes();

        const subjectData = { name: 'Mathematics', class: classId };
        await new Subject(subjectData).save();

        const duplicate = new Subject(subjectData);

        try {
            await duplicate.save();
            fail('Expected duplicate subject to throw error');
        } catch (error) {
            expect(error.name).toBe('MongoServerError');
            expect(error.code).toBe(11000);
        }
    });
});
