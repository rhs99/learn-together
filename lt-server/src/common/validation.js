/**
 * Middleware factory for validating request data with Zod schemas
 * @param {Object} schema - The Zod schema object with query, params, body keys
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
    try {
        // Initialize errors array to collect all validation errors
        const errors = [];

        // Validate request params
        if (schema.params) {
            const result = schema.params.safeParse(req.params);
            if (!result.success) {
                errors.push(...extractZodErrors(result.error));
            } else {
                req.params = result.data;
            }
        }

        // Validate query params
        if (schema.query) {
            const result = schema.query.safeParse(req.query);
            if (!result.success) {
                errors.push(...extractZodErrors(result.error));
            } else {
                req.query = result.data;
            }
        }

        // Validate request body
        if (schema.body) {
            const result = schema.body.safeParse(req.body);
            if (!result.success) {
                errors.push(...extractZodErrors(result.error));
            } else {
                req.body = result.data;
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation failed',
                errors,
            });
        }

        next();
    } catch (error) {
        console.error('Unexpected validation error:', error);
        return res.status(500).json({ message: 'Internal server error during validation' });
    }
};

/**
 * Extract errors from Zod validation result
 * @param {z.ZodError} zodError - The Zod error to format
 * @param {string} source - Source of the error (query, body, params)
 * @returns {Array} Formatted error array
 */
const extractZodErrors = (zodError) => {
    if (!zodError || !zodError.errors || !Array.isArray(zodError.errors)) {
        return [{ path: 'unknown', message: 'Unknown validation error' }];
    }

    return zodError.errors.map((err) => {
        // Get the field name from the path or code
        let fieldName = 'unknown';

        if (err.path && Array.isArray(err.path) && err.path.length > 0) {
            fieldName = err.path[err.path.length - 1];
        } else if (err.code === 'invalid_type' && err.received === 'undefined') {
            // Handle required field errors
            fieldName = err.path ? err.path[0] : 'unknown';
        }

        return {
            path: fieldName,
            message: err.message,
        };
    });
};

module.exports = { validate };
