const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const { getTestApp } = require('./test-app');

process.env.NODE_ENV = 'test';
process.env.SECRET_KEY = process.env.SECRET_KEY || 'test-secret-key';

jest.mock('../src/common/middlewares', () => {
    const originalMiddlewares = jest.requireActual('../src/common/middlewares');
    return {
        ...originalMiddlewares,
        hasAdminPrivilege: (req, res, next) => {
            next();
        },
    };
});

jest.mock('../src/services/cache', () => {
    return {
        cacheService: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
        },
    };
});

jest.mock('../src/common/utils', () => {
    const originalModule = jest.requireActual('../src/common/utils');
    return {
        ...originalModule,
        deleteFile: jest.fn(),
        sendEmail: jest.fn(),
        createToken: jest.fn(),
        createTokenForPassword: jest.fn(),
    };
});

const app = getTestApp();
const testAgent = request(app);

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
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }

    jest.clearAllMocks();
});

afterAll(async () => {
    await mongoose.connection.close();

    if (mongoServer) {
        await mongoServer.stop();
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
});

global.testApp = app;
global.testRequest = testAgent;
