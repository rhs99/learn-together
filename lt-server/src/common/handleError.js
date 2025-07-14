// lt-server/src/common/handleError.js

/**
 * Reusable error handler for Express controllers
 * @param {object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Fallback error message
 * @param {number} [defaultStatus=500] - Fallback status code
 */
function handleError(res, error, defaultMessage, defaultStatus = 500) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(defaultStatus).json({ message: defaultMessage });
}

module.exports = handleError;
