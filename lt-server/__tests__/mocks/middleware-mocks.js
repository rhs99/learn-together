/**
 * Test middleware overrides
 *
 * This file provides mock middleware implementations for testing purposes.
 */

// Store the original middlewares
const originalMiddlewares = jest.requireActual('../../src/common/middlewares');

// Create factory functions for consistent mocks that can be reset
const createTestAdminUser = () => ({
    userId: 'test-admin-id',
    privileges: ['admin'],
});

// Initialize test admin user
let testAdminUser = createTestAdminUser();

// Mock the extractAndVerifyToken middleware
const extractAndVerifyToken = (req, res, next) => {
    req.user = testAdminUser;
    next();
};

// Mock the hasAdminPrivilege middleware
const hasAdminPrivilege = (req, res, next) => {
    // Already set by the extractAndVerifyToken mock
    next();
};

// Function to reset middleware mocks to initial state
const resetMiddlewareMocks = () => {
    testAdminUser = createTestAdminUser();
};

module.exports = {
    ...originalMiddlewares,
    extractAndVerifyToken,
    hasAdminPrivilege,
    testAdminUser,
    resetMiddlewareMocks,
};
