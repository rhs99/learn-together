const isDocker = process.env.DOCKER_ENV === 'true';

module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/setup.js', '/__tests__/helpers/'],
  testTimeout: isDocker ? 30000 : 120000,
  maxWorkers: 1,
  detectOpenHandles: !isDocker,
  cache: !isDocker,
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/scripts/**',
    '!src/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
