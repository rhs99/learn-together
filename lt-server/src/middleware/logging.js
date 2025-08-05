const logger = require('../config/logger');

/**
 * HTTP request logging middleware
 * Logs all incoming requests with response times and status codes
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log the incoming request
    logger.http('Incoming Request', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        contentType: req.get('Content-Type'),
        userId: req.user ? req.user.id : undefined,
    });

    // Override res.end to capture response details
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - start;

        // Log the response
        logger.request(req, res, duration);

        // Call the original end method
        originalEnd.call(this, chunk, encoding);
    };

    next();
};

/**
 * Error logging middleware
 * Should be used after all routes and before final error handler
 */
const errorLogger = (err, req, res, next) => {
    // Log the error with request context
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
