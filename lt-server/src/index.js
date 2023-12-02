const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectedUsers = require('./common/connected-users');
const classRouter = require('./routes/class');
const privilegeRouter = require('./routes/privilege');
const subjectRouter = require('./routes/subject');
const chapterRouter = require('./routes/chapter');
const userRouter = require('./routes/user');
const questionRouter = require('./routes/question');
const answerRouter = require('./routes/answer');
const tagRouter = require('./routes/tag');
const qaRouter = require('./routes/qavote');

const app = express();

app.use(cors());
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
app.use('/votes', qaRouter);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (socket, req) => {
    const queryParams = new URLSearchParams(req.url.split('?')[1]);
    const userName = queryParams.get('userName');

    if (userName) {
        connectedUsers.set(userName, socket);
        socket.on('close', () => {
            connectedUsers.delete(userName);
        });
    }
});

const PORT = process.env.PORT;
try {
    server.listen(PORT, () => {
        console.log(`Connected successfully on port ${PORT}`);
    });
} catch (error) {
    if (error instanceof Error) {
        console.error(`Error occured: ${error.message}`);
    }
}

const DB_URL = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Mongo connected successfully');
    } catch (e) {
        console.log(e.message);
    }
};

connectDB();

module.exports = { connectedUsers };
