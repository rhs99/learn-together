const mongoose = require('mongoose');
const Class = require('../models/class');
const Subject = require('../models/subject');
const Chapter = require('../models/chapter');
const User = require('../models/user');

const DB_URL = process.env.MONGODB_URI;

const classData = [{ name: '6' }, { name: '7' }, { name: '8' }, { name: '9-10' }, { name: '11-12' }];

const subjectMapping = {
    6: ['Math', 'Science'],
    7: ['Math', 'Science'],
    8: ['Math', 'Science'],
    '9-10': ['Math', 'Physics', 'Chemistry', 'Biology'],
    '11-12': ['Math', 'Physics', 'Chemistry', 'Biology'],
};

async function createChapters(subjectId, subjectName) {
    const chapterNames = [];

    // Generate 5 chapter names for each subject
    for (let i = 1; i <= 5; i++) {
        chapterNames.push(`${subjectName} Chapter ${i}`);
    }

    const chapterPromises = chapterNames.map(async (name) => {
        const chapter = new Chapter({
            name,
            subject: subjectId,
        });

        const savedChapter = await chapter.save();
        return savedChapter._id;
    });

    return Promise.all(chapterPromises);
}

async function createSubjects(classId, className) {
    const subjects = subjectMapping[className];

    const subjectPromises = subjects.map(async (subjectName) => {
        const subject = new Subject({
            name: subjectName,
            class: classId,
        });

        const savedSubject = await subject.save();

        // Create chapters for this subject
        const chapterIds = await createChapters(savedSubject._id, subjectName);

        // Update the subject with chapter references
        savedSubject.chapters = chapterIds;
        await savedSubject.save();

        return savedSubject._id;
    });

    return Promise.all(subjectPromises);
}

async function createClasses() {
    const classPromises = classData.map(async (classInfo) => {
        try {
            // Check if class already exists
            const existingClass = await Class.findOne({ name: classInfo.name });
            if (existingClass) {
                console.log(`Class ${classInfo.name} already exists. Skipping creation.`);
                return existingClass;
            }

            // Create new class
            const newClass = new Class({
                name: classInfo.name,
            });

            const savedClass = await newClass.save();

            // Create subjects for this class
            const subjectIds = await createSubjects(savedClass._id, classInfo.name);

            // Update the class with subject references
            savedClass.subjects = subjectIds;
            await savedClass.save();

            console.log(`Created class: ${classInfo.name} with ${subjectIds.length} subjects`);
            return savedClass;
        } catch (error) {
            console.error(`Error creating class ${classInfo.name}:`, error);
        }
    });

    return Promise.all(classPromises);
}

async function getAdminUser() {
    try {
        const admin = await User.findOne({
            email: process.env.ADMIN_EMAIL,
        }).exec();

        if (!admin) {
            console.log(`Admin user with email ${process.env.ADMIN_EMAIL} not found. Please run setup.js first.`);
            throw new Error('Admin user not found. Please run setup.js first.');
        }

        return admin;
    } catch (error) {
        console.error('Error finding admin user:', error);
        throw error;
    }
}

async function populateData() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(DB_URL, { dbName: 'lt-db' });
        console.log('Connected to database');

        // Get admin user to ensure it exists
        const admin = await getAdminUser();
        console.log(`Found admin user: ${admin.userName}`);

        // Create classes, subjects, and chapters
        console.log('Starting to create classes, subjects, and chapters...');
        await createClasses();
        console.log('Data population complete!');

        // Disconnect from database
        await mongoose.disconnect();
        console.log('Disconnected from database');
    } catch (error) {
        console.error('Error during data population:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

// Run the script
populateData();
