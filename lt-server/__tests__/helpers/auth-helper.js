const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Config = require('../../src/config');

const SECRET_KEY = Config.SECRET_KEY || 'test-secret-key';

const createTestToken = (payload, secret = SECRET_KEY) => {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
};

const createAdminToken = (overrides = {}) => {
    const payload = {
        _id: overrides._id || new mongoose.Types.ObjectId().toString(),
        ...overrides,
    };

    return createTestToken(payload);
};

const createUserToken = (overrides = {}) => {
    const payload = {
        _id: overrides._id || new mongoose.Types.ObjectId().toString(),
        ...overrides,
    };

    return createTestToken(payload);
};

const withAuth = (request, token) => {
    return request.set('Authorization', `Bearer ${token}`);
};

module.exports = {
    createTestToken,
    createAdminToken,
    createUserToken,
    withAuth,
};
