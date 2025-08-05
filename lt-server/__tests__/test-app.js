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
// This shouldn't output any logs from the logger itself

/**
 * Get a fresh instance of the Express app configured for testing
 *
 * @returns {object} Express app instance
 */
const getTestApp = () => {
    // Clear any cached version of the app
    jest.resetModules();

    // Import the main app - it won't auto-connect or start server in test mode
    const { app } = require('../src/index.js');

    return app;
};

module.exports = { getTestApp };
