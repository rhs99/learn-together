// lt-server/src/common/handleError.js
const logger = require('../config/logger');

/**
 * Reusable error handler for Express controllers
 * @param {object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Fallback error message
 * @param {number} [defaultStatus=500] - Fallback status code
 */
function handleError(res, error, defaultMessage, defaultStatus = 500) {
    const statusCode = error.statusCode || defaultStatus;
    const message = error.message || defaultMessage;

    // Log the error with appropriate level
    if (statusCode >= 500) {
        logger.error('Server Error', {
            error: message,
            statusCode,
            stack: error.stack,
            originalError: error,
        });
    } else if (statusCode >= 400) {
        logger.warn('Client Error', {
            error: message,
            statusCode,
            originalError: error,
        });
    }

    return res.status(statusCode).json({ message });
}

module.exports = handleError;
