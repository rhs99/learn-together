const Util = require('./utils');
const User = require('../models/user');
const { UnauthorizedError, ForbiddenError } = require('./error');

const extractAndVerifyTokenIfPresent = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
            const data = Util.verityToken(token);
            req.user = data._id;
        } catch (error) {
            console.error('Invalid or expired token:', error.message);
        }
    }
    next();
};

const extractAndVerifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
            const data = Util.verityToken(token);
            req.user = data._id;
            return next();
        } catch {
            return next(new UnauthorizedError('Invalid or expired token.'));
        }
    }
    return next(new UnauthorizedError('Authorization token required.'));
};

const hasAdminPrivilege = async (req, res, next) => {
    const userId = req.user;
    if (!userId) {
        return next(new UnauthorizedError('User not authenticated.'));
    }
    const user = await User.findById(userId).populate('privileges').exec();
    if (!user) {
        return next(new UnauthorizedError('User not found.'));
    }
    if (user && Array.isArray(user.privileges) && user.privileges.some((p) => p.name === 'admin')) {
        return next();
    }
    return next(new ForbiddenError('Admin privilege required.'));
};

module.exports = { extractAndVerifyToken, hasAdminPrivilege, extractAndVerifyTokenIfPresent };
