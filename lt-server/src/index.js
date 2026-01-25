const http = require('http');
const { URLSearchParams } = require('url');
const WebSocket = require('ws');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'test') {
    require('dotenv').config();
}

const Config = require('./config');
const logger = require('./config/logger');
const { requestLogger, errorLogger } = require('./middleware/logging');

const connectedUsers = require('./common/connected-users');
const classRouter = require('./routes/class');
const privilegeRouter = require('./routes/privilege');
const subjectRouter = require('./routes/subject');
const chapterRouter = require('./routes/chapter');
const userRouter = require('./routes/user');
const questionRouter = require('./routes/question');
const answerRouter = require('./routes/answer');
const tagRouter = require('./routes/tag');
const voteRouter = require('./routes/vote');
const uploader = require('./routes/upload');
const paymentMethod = require('./routes/paymentMethod');
const donation = require('./routes/donation');
const handleError = require('./common/handleError');

if (Config.NODE_ENV !== 'test') {
    require('./services/cache');
}

const app = express();

// Request logging middleware (should be early in middleware stack)
if (Config.NODE_ENV !== 'test') {
    app.use(requestLogger);
}

const allowedOrigins = Config.CLIENT_URL
    ? Config.CLIENT_URL.split(',').map((url) => url.trim())
    : ['http://localhost:3000'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                logger.warn('CORS blocked request from unauthorized origin', { origin });
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/classes', classRouter);
app.use('/privileges', privilegeRouter);
app.use('/subjects', subjectRouter);
app.use('/chapters', chapterRouter);
app.use('/users', userRouter);
app.use('/questions', questionRouter);
app.use('/answers', answerRouter);
app.use('/tags', tagRouter);
app.use('/votes', voteRouter);
app.use('/upload', uploader);
app.use('/paymentMethods', paymentMethod);

app.use('/donations', donation);

// Error logging middleware (before error handler)
app.use(errorLogger);

app.use((err, req, res, next) => {
    handleError(res, err, 'Internal Server Error', 500);
});

const server = http.createServer(app);

let wss;
if (Config.NODE_ENV !== 'test') {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (socket, req) => {
        const queryParams = new URLSearchParams(req.url.split('?')[1]);
        const userName = queryParams.get('userName');

        logger.info('WebSocket connection established', { userName, ip: req.socket.remoteAddress });

        if (userName) {
            connectedUsers.set(userName, socket);
            logger.debug('User added to connected users', { userName, totalConnections: connectedUsers.size });

            socket.on('close', () => {
                connectedUsers.delete(userName);
                logger.debug('User disconnected', { userName, totalConnections: connectedUsers.size });
            });
        } else {
            logger.warn('WebSocket connection without userName', { ip: req.socket.remoteAddress });
        }
    });
}

const connectDB = async (url, dbName) => {
    const isTest = Config.NODE_ENV === 'test';

    if (isTest) {
        if (!dbName.includes('test')) {
            throw new Error(
                'TEST SAFETY: Database name must include "test" when running in test mode to prevent production DB access.',
            );
        }
    }

    if (!isTest) {
        const dbType = Config.USE_REMOTE_DB ? 'Remote' : 'Docker';
        logger.info('Database selection', { dbType, dbName });
    }

    try {
        logger.info('Attempting to connect to MongoDB', { dbName });

        const options = {
            dbName,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(url, options);
        logger.info('Successfully connected to MongoDB', { dbName });
        return mongoose.connection;
    } catch (error) {
        logger.error('MongoDB connection error', { error: error.message, dbName });
        throw error;
    }
};

const startServer = (port) => {
    const PORT = port || Config.PORT;
    return new Promise((resolve, reject) => {
        try {
            server.listen(PORT, () => {
                logger.info('Server started successfully', { port: PORT, environment: Config.NODE_ENV });
                resolve(server);
            });
        } catch (error) {
            logger.error('Server startup error', { error: error.message, port: PORT });
            reject(error);
        }
    });
};

if (require.main === module && Config.NODE_ENV !== 'test') {
    const dbUrl = Config.USE_REMOTE_DB ? Config.REMOTE_MONGODB_URI : Config.MONGODB_URI;
    const dbName = 'lt-db';

    connectDB(dbUrl, dbName)
        .then(() => {
            startServer();
        })
        .catch((err) => {
            logger.error('Failed to start application', { error: err.message, stack: err.stack });
            process.exit(1);
        });
}

module.exports = {
    app,
    server,
    connectDB,
    startServer,
    connectedUsers,
};
