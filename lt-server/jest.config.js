module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  setupFilesAfterEnv: ['./__tests__/setup.js'],
  testPathIgnorePatterns: ['./__tests__/setup.js'],
  // Add timeout settings for Docker
  testTimeout: 30000,
  // Force exit after tests complete
  forceExit: true,
  // Limit concurrent tests in Docker for stability
  maxConcurrency: 1,
  // Help identify any hanging processes
  detectOpenHandles: true,
  // Don't cache test results between runs
  cache: false
};
