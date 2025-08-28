const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    logger.http('Incoming Request', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        contentType: req.get('Content-Type'),
        userId: req.user ? req.user.id : undefined,
    });

    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - start;

        const logData = {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            statusCode: res.statusCode,
            responseTime: duration ? `${duration}ms` : undefined,
            userId: req.user ? req.user.id : undefined,
        };

        if (res.statusCode >= 400) {
            logger.warn('HTTP Request Error', logData);
        } else {
            logger.http('HTTP Request', logData);
        }

        originalEnd.call(this, chunk, encoding);
    };

    next();
};

const errorLogger = (err, req, res, next) => {
    logger.error('Request Error', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        userId: req.user ? req.user.id : undefined,
        body: req.body,
        params: req.params,
        query: req.query,
        statusCode: err.statusCode || 500,
    });

    next(err);
};

module.exports = {
    requestLogger,
    errorLogger,
};
