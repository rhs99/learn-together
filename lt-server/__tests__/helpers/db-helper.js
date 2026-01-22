const mongoose = require('mongoose');

const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};

const clearCollection = async (collectionName) => {
    if (mongoose.connection.collections[collectionName]) {
        await mongoose.connection.collections[collectionName].deleteMany({});
    }
};

const countDocuments = async (Model, filter = {}) => {
    return await Model.countDocuments(filter);
};

const documentExists = async (Model, filter) => {
    const count = await Model.countDocuments(filter);
    return count > 0;
};
const createDocument = async (Model, data) => {
    const document = new Model(data);
    return await document.save();
};

const createDocuments = async (Model, dataArray) => {
    return await Model.insertMany(dataArray);
};
const getConnectionState = () => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };
    return states[mongoose.connection.readyState] || 'unknown';
};

const waitForDatabase = async (timeout = 5000) => {
    const startTime = Date.now();

    while (mongoose.connection.readyState !== 1) {
        if (Date.now() - startTime > timeout) {
            throw new Error('Database connection timeout');
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
};

module.exports = {
    clearDatabase,
    clearCollection,
    countDocuments,
    documentExists,
    createDocument,
    createDocuments,
    getConnectionState,
    waitForDatabase,
};
