const Util = require('./utils');
const User = require('../models/user');
const { UnauthorizedError, ForbiddenError } = require('./error');
const logger = require('../config/logger');

const extractAndVerifyTokenIfPresent = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
            const data = Util.verityToken(token);
            req.user = data._id;
            logger.debug('Token verified successfully (optional)', { userId: data._id });
        } catch (error) {
            logger.warn('Invalid or expired token in optional verification', { error: error.message });
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
            logger.debug('Token verified successfully', { userId: data._id, path: req.path });
            return next();
        } catch (error) {
            logger.security('Token verification failed', {
                error: error.message,
                path: req.path,
                ip: req.ip,
            });
            return next(new UnauthorizedError('Invalid or expired token.'));
        }
    }
    logger.security('Authorization token missing', { path: req.path, ip: req.ip });
    return next(new UnauthorizedError('Authorization token required.'));
};

const hasAdminPrivilege = async (req, res, next) => {
    const userId = req.user;
    if (!userId) {
        logger.security('Admin privilege check without authenticated user', { path: req.path, ip: req.ip });
        return next(new UnauthorizedError('User not authenticated.'));
    }

    const user = await User.findById(userId).populate('privileges').exec();
    if (!user) {
        logger.security('Admin privilege check for non-existent user', { userId, path: req.path });
        return next(new UnauthorizedError('User not found.'));
    }

    const hasAdminPriv = user && Array.isArray(user.privileges) && user.privileges.some((p) => p.name === 'admin');

    if (hasAdminPriv) {
        logger.info('Admin privilege verified', { userId, userName: user.userName, path: req.path });
        return next();
    }

    logger.security('Admin privilege denied', {
        userId,
        userName: user.userName,
        path: req.path,
        privileges: user.privileges.map((p) => p.name),
    });
    return next(new ForbiddenError('Admin privilege required.'));
};

module.exports = { extractAndVerifyToken, hasAdminPrivilege, extractAndVerifyTokenIfPresent };
