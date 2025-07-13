const mongoose = require('mongoose');
const Chapter = require('../../../src/models/chapter');

describe('Chapter Model Tests', () => {
    let subjectId;

    beforeEach(async () => {
        subjectId = new mongoose.Types.ObjectId();
    });

    afterEach(async () => {
        await Chapter.deleteMany({});
    });

    it('should create a chapter with and without questions', async () => {
        const basicChapter = await new Chapter({
            name: 'Introduction to Programming',
            subject: subjectId,
        }).save();

        expect(basicChapter.name).toBe('Introduction to Programming');
        expect(basicChapter.subject.toString()).toBe(subjectId.toString());
        expect(basicChapter.questions).toEqual([]);

        const questions = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
        const chapterWithQuestions = await new Chapter({
            name: 'Advanced Programming',
            subject: subjectId,
            questions,
        }).save();

        expect(chapterWithQuestions.name).toBe('Advanced Programming');
        expect(chapterWithQuestions.questions.length).toBe(2);
        expect(chapterWithQuestions.questions.map((id) => id.toString())).toEqual(questions.map((id) => id.toString()));
    });

    it('should enforce required fields at model level', async () => {
        const chapterWithoutName = new Chapter({ subject: subjectId });
        await expect(chapterWithoutName.save()).rejects.toThrow();
    });

    it('should enforce unique compound index on name and subject', async () => {
        await Chapter.createIndexes();

        const chapterData = { name: 'Algorithms', subject: subjectId };
        await new Chapter(chapterData).save();

        const duplicate = new Chapter(chapterData);

        try {
            await duplicate.save();
            fail('Expected duplicate chapter to throw error');
        } catch (error) {
            expect(error.name).toBe('MongoServerError');
            expect(error.code).toBe(11000);
        }
    });
});
