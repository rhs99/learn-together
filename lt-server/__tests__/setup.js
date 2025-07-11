const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const sinon = require('sinon');

// Mock the Redis cache service
jest.mock('../src/services/cache', () => {
  return {
    cacheService: {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn()
    }
  };
});

let mongoServer;

// Set up MongoDB connection before all tests
beforeAll(async () => {
  // Check if we're running in Docker
  const isDocker = process.env.DOCKER_ENV === 'true';
  
  if (isDocker) {
    // Use the real MongoDB from docker-compose
    const mongoUri = 'mongodb://lt-database:27017/lt-db-test';
    await mongoose.connect(mongoUri);
  } else {
    // Use MongoDB Memory Server for local development
    mongoServer = await MongoMemoryServer.create({
      binary: {
        skipMD5: true, // This can help with container issues
      },
      autoStart: true,
    });
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  jest.clearAllMocks();
  sinon.restore();
});

// Stop MongoDB Memory Server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
