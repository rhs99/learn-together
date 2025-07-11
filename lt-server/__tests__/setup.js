const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const sinon = require('sinon');

jest.mock('../src/services/cache', () => {
    return {
        cacheService: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
        },
    };
});

let mongoServer;

beforeAll(async () => {
    const isDocker = process.env.DOCKER_ENV === 'true';

    if (isDocker) {
        const mongoUri = 'mongodb://lt-database:27017/lt-db-test';
        await mongoose.connect(mongoUri);
    } else {
        mongoServer = await MongoMemoryServer.create({
            binary: {
                skipMD5: true,
            },
            autoStart: true,
        });
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    }
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
    jest.clearAllMocks();
    sinon.restore();
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});
