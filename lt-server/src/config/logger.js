const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const Config = require('../config');

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const logColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

winston.addColors(logColors);

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

const logsDir = path.join(__dirname, '../../logs');

const transports = [];

if (Config.NODE_ENV !== 'production' && Config.NODE_ENV !== 'test') {
    transports.push(
        new winston.transports.Console({
            level: 'debug',
            format: consoleFormat,
        }),
    );
}

if (Config.NODE_ENV === 'test') {
    transports.push(
        new winston.transports.Console({
            silent: true,
        }),
    );
}

if (Config.NODE_ENV !== 'test') {
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

const logger = winston.createLogger({
    level: Config.LOG_LEVEL,
    levels: logLevels,
    format: logFormat,
    transports,
    silent: Config.NODE_ENV === 'test',
    exitOnError: false,
});

logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

// Console.log wrapper when USE_CONSOLE_LOG is enabled
if (Config.USE_CONSOLE_LOG) {
    const consoleLogger = {
        error: (...args) => console.log('[ERROR]', ...args),
        warn: (...args) => console.log('[WARN]', ...args),
        info: (...args) => console.log('[INFO]', ...args),
        http: (...args) => console.log('[HTTP]', ...args),
        debug: (...args) => console.log('[DEBUG]', ...args),
        stream: {
            write: (message) => console.log('[HTTP]', message.trim()),
        },
    };

    module.exports = consoleLogger;
} else {
    module.exports = logger;
}
