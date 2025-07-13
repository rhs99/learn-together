const mongoose = require('mongoose');
const Class = require('../../../src/models/class');

describe('Class Model Tests', () => {
    it('should create a new class successfully', async () => {
        const classData = {
            name: 'Grade 10',
        };

        const newClass = new Class(classData);
        const savedClass = await newClass.save();

        expect(savedClass._id).toBeDefined();
        expect(savedClass.name).toBe('Grade 10');
        expect(savedClass.subjects).toEqual([]);
    });

    it('should create a class with subjects successfully', async () => {
        const subjectId1 = new mongoose.Types.ObjectId();
        const subjectId2 = new mongoose.Types.ObjectId();

        const classData = {
            name: 'Grade 11',
            subjects: [subjectId1, subjectId2],
        };

        const newClass = new Class(classData);
        const savedClass = await newClass.save();

        expect(savedClass._id).toBeDefined();
        expect(savedClass.name).toBe('Grade 11');
        expect(savedClass.subjects.length).toBe(2);
        expect(savedClass.subjects[0].toString()).toBe(subjectId1.toString());
        expect(savedClass.subjects[1].toString()).toBe(subjectId2.toString());
    });

    it('should not create a class without a name', async () => {
        const classData = {};

        const newClass = new Class(classData);

        await expect(newClass.save()).rejects.toThrow();
    });

    it('should not allow duplicate class names', async () => {
        const classData = {
            name: 'Grade 12',
        };

        await new Class(classData).save();

        const duplicateClass = new Class(classData);

        await expect(duplicateClass.save()).rejects.toThrow();
    });
});
