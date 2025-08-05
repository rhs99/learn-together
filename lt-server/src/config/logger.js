const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log levels
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define colors for each log level
const logColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

// Add colors to winston
winston.addColors(logColors);

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf((info) => {
        const { timestamp, level, message, stack, ...meta } = info;
        const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';

        if (stack) {
            return `${timestamp} [${level.toUpperCase()}]: ${message}\nStack: ${stack}${metaString ? `\nMeta: ${metaString}` : ''}`;
        }

        return `${timestamp} [${level.toUpperCase()}]: ${message}${metaString ? `\nMeta: ${metaString}` : ''}`;
    }),
);

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf((info) => {
        const { timestamp, level, message, stack, ...meta } = info;
        const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';

        if (stack) {
            return `${timestamp} ${level}: ${message}\n${stack}${metaString ? `\n${metaString}` : ''}`;
        }

        return `${timestamp} ${level}: ${message}${metaString ? ` ${metaString}` : ''}`;
    }),
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');

// Define transports
const transports = [];

// Console transport for development (but not for tests)
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    transports.push(
        new winston.transports.Console({
            level: 'debug',
            format: consoleFormat,
        }),
    );
}

// Silent console transport for tests (prevents logs from being output during tests)
if (process.env.NODE_ENV === 'test') {
    transports.push(
        new winston.transports.Console({
            silent: true,
        }),
    );
}

// File transports for all environments except test
if (process.env.NODE_ENV !== 'test') {
    // Error logs - daily rotate
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            format: logFormat,
            maxSize: '20m',
            maxFiles: '30d',
            zippedArchive: true,
            handleExceptions: true,
            handleRejections: true,
        }),
    );

    // Combined logs - daily rotate
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            format: logFormat,
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true,
        }),
    );

    // HTTP request logs - daily rotate
    transports.push(
        new DailyRotateFile({
            filename: path.join(logsDir, 'http-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'http',
            format: logFormat,
            maxSize: '20m',
            maxFiles: '7d',
            zippedArchive: true,
        }),
    );
}

// Create the logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    levels: logLevels,
    format: logFormat,
    transports,
    silent: process.env.NODE_ENV === 'test', // Silence all logs in test environment
    exitOnError: false,
});

// Create a stream object for Morgan HTTP logging
logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

// Add method to log database operations
logger.database = (operation, collection, data = {}) => {
    logger.debug('Database Operation', {
        operation,
        collection,
        data: typeof data === 'object' ? JSON.stringify(data) : data,
        timestamp: new Date().toISOString(),
    });
};

// Add method to log API requests
logger.request = (req, res, duration) => {
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
};

// Add method to log authentication events
logger.auth = (event, userId, details = {}) => {
    logger.info('Authentication Event', {
        event,
        userId,
        ...details,
        timestamp: new Date().toISOString(),
    });
};

// Add method to log business logic events
logger.business = (event, details = {}) => {
    logger.info('Business Event', {
        event,
        ...details,
        timestamp: new Date().toISOString(),
    });
};

// Add method to log security events
logger.security = (event, details = {}) => {
    logger.warn('Security Event', {
        event,
        ...details,
        timestamp: new Date().toISOString(),
    });
};

module.exports = logger;
