const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const sinon = require('sinon');
const request = require('supertest');
const { getTestApp } = require('./test-app');

// Make sure we're in test mode
process.env.NODE_ENV = 'test';

// Mock middleware for authentication
jest.mock('../src/common/middlewares', () => require('./mocks/middleware-mocks'));

// Mock cache service for tests
jest.mock('../src/services/cache', () => {
    return {
        cacheService: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
        },
    };
});

// Get the app from the main app module
const app = getTestApp();
// Create supertest agent for making HTTP requests
const testAgent = request(app);

// Import database connection function
const { connectDB } = require('../src/index');

let mongoServer;

beforeAll(async () => {
    const isDocker = process.env.DOCKER_ENV === 'true';

    if (isDocker) {
        const mongoUri = 'mongodb://lt-database:27017/lt-db-test';
        await connectDB(mongoUri, 'lt-db-test');
    } else {
        mongoServer = await MongoMemoryServer.create({
            binary: {
                skipMD5: true,
            },
            autoStart: true,
        });
        const mongoUri = mongoServer.getUri();
        await connectDB(mongoUri, 'lt-db-test');
    }
});

afterEach(async () => {
    // Clear all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        // Use deleteMany for better performance during tests
        await collections[key].deleteMany({});
    }

    // Clear all Mongoose model caches - this helps prevent test leakage
    // Safely clear Mongoose models
    if (mongoose.models) {
        Object.keys(mongoose.models).forEach((modelName) => {
            delete mongoose.models[modelName];
        });
    }

    // Reset all mocks and stubs
    jest.clearAllMocks();
    jest.resetModules();
    sinon.restore();

    // Reset custom middleware mocks if available
    try {
        const { resetMiddlewareMocks } = require('./mocks/middleware-mocks');
        if (typeof resetMiddlewareMocks === 'function') {
            resetMiddlewareMocks();
        }
    } catch (error) {
        // If middleware mocks are not loaded yet, ignore
    }

    // Reset model and service mocks if available
    try {
        const { resetAllMocks } = require('./mocks/model-mocks');
        if (typeof resetAllMocks === 'function') {
            resetAllMocks();
        }
    } catch (error) {
        // If model mocks are not loaded yet, ignore
    }

    try {
        const { resetServiceMocks } = require('./mocks/service-mocks');
        if (typeof resetServiceMocks === 'function') {
            resetServiceMocks();
        }
    } catch (error) {
        // If service mocks are not loaded yet, ignore
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

// Export app and request agent for tests to use
global.testApp = app;
global.testRequest = testAgent;
