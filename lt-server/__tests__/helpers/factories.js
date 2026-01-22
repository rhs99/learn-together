const mongoose = require('mongoose');

const createObjectId = (id) => {
    return id ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId();
};

const createUserData = (overrides = {}) => {
    const defaults = {
        userName: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'TestPassword123!',
        privileges: [],
        questions: [],
        answers: [],
        favourites: [],
    };

    return { ...defaults, ...overrides };
};

const createClassData = (overrides = {}) => {
    const defaults = {
        name: `Test Class ${Date.now()}`,
        description: 'Test class description',
    };

    return { ...defaults, ...overrides };
};

const createSubjectData = (overrides = {}) => {
    const defaults = {
        name: `Test Subject ${Date.now()}`,
        description: 'Test subject description',
    };

    return { ...defaults, ...overrides };
};

const createChapterData = (overrides = {}) => {
    const defaults = {
        name: `Test Chapter ${Date.now()}`,
        description: 'Test chapter description',
        subject: createObjectId(),
    };

    return { ...defaults, ...overrides };
};

const createQuestionData = (overrides = {}) => {
    const defaults = {
        title: `Test Question ${Date.now()}`,
        text: 'This is a test question',
        tags: [],
        askedBy: createObjectId(),
        chapter: createObjectId(),
    };

    return { ...defaults, ...overrides };
};

const createAnswerData = (overrides = {}) => {
    const defaults = {
        text: 'This is a test answer',
        answeredBy: createObjectId(),
        question: createObjectId(),
    };

    return { ...defaults, ...overrides };
};

const createTagData = (overrides = {}) => {
    const defaults = {
        name: `test-tag-${Date.now()}`,
        description: 'Test tag description',
    };

    return { ...defaults, ...overrides };
};

const createPrivilegeData = (overrides = {}) => {
    const defaults = {
        name: `test-privilege-${Date.now()}`,
        description: 'Test privilege description',
    };

    return { ...defaults, ...overrides };
};

const createNotificationData = (overrides = {}) => {
    const defaults = {
        userId: createObjectId(),
        type: 'new_answer',
        details: createObjectId(),
        read: false,
    };

    return { ...defaults, ...overrides };
};

module.exports = {
    createObjectId,
    createUserData,
    createClassData,
    createSubjectData,
    createChapterData,
    createQuestionData,
    createAnswerData,
    createTagData,
    createPrivilegeData,
    createNotificationData,
};
