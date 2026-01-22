/**
 * Test App Module
 *
 * This module provides the Express app for testing purposes.
 * It ensures that tests run in the correct environment and that
 * the app is properly configured for testing without starting
 * actual servers or connecting to production databases.
 */

// Set the environment to test mode before importing any modules
process.env.NODE_ENV = 'test';

const getTestApp = () => {
    const { app } = require('../src/index.js');

    return app;
};

module.exports = { getTestApp };
