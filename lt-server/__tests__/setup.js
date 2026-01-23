const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const { getTestApp } = require('./test-app');

process.env.NODE_ENV = 'test';
process.env.SECRET_KEY = 'test-secret-key-for-jwt-signing';

// SAFETY: Block production database environment variables during tests
delete process.env.REMOTE_MONGODB_URI;
delete process.env.MONGODB_URI;
delete process.env.USE_REMOTE_DB;

// SAFETY: Block production Supabase credentials
delete process.env.SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;
delete process.env.SUPABASE_ANON_KEY;

// Mock Config module to return test configuration without environment variables
jest.mock('../src/config', () => ({
    LT_HOST: 'http://localhost:3000',
    SUPABASE_URL: 'http://mock-supabase-url',
    SUPABASE_ANON_KEY: 'mock-anon-key',
    SUPABASE_SERVICE_ROLE_KEY: 'mock-service-role-key',
    SUPABASE_STORAGE_BUCKET: 'mock-test-bucket',
    REDIS_HOST: 'localhost',
    REDIS_PORT: 6379,
}));

// Mock Supabase client to prevent any real API calls
jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => ({
            storage: {
                from: jest.fn(() => ({
                    getPublicUrl: jest.fn((fileName) => ({
                        data: { publicUrl: `http://mock-storage/mock-test-bucket/${fileName}` },
                    })),
                    createSignedUploadUrl: jest.fn(() => ({
                        data: { signedUrl: 'http://mock-storage/upload-url', token: 'mock-token' },
                        error: null,
                    })),
                    remove: jest.fn(() => ({
                        data: null,
                        error: null,
                    })),
                })),
            },
        })),
    };
});

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

    // SAFETY: Tests always use isolated databases (MongoDB Memory Server or Docker test DB)
    if (isDocker) {
        await connectDB('mongodb://lt-database:27017/lt-db-test', 'lt-db-test');
    } else {
        mongoServer = await MongoMemoryServer.create({
            binary: {
                skipMD5: true,
                checkMD5: false,
            },
            autoStart: true,
        });
        const mongoUri = mongoServer.getUri();
        await connectDB(mongoUri, 'lt-db-test');
    }
}, 60000);

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }

    jest.clearAllMocks();
}, 30000);

afterAll(async () => {
    await mongoose.connection.close();

    if (mongoServer) {
        await mongoServer.stop();
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
}, 30000);

global.testApp = app;
global.testRequest = testAgent;
