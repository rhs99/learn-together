const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const classRouter = require('./routes/class');
const privilegeRouter = require('./routes/privilege');
const subjectRouter = require('./routes/subject');
const chapterRouter = require('./routes/chapter');
const userRouter = require('./routes/user');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/classes', classRouter);
app.use('/privileges', privilegeRouter);
app.use('/subjects', subjectRouter);
app.use('/chapters', chapterRouter);
app.use('/users', userRouter);

const PORT = 5000;

try {
    app.listen(PORT, () => {
        console.log(`Connected successfully on port ${PORT}`);
    });
} catch (error) {
    if (error instanceof Error) {
        console.error(`Error occured: ${error.message}`);
    }
}

const DB_URL = 'mongodb://mongo:27017/lt-db';

const connectDB = async () => {
    await mongoose
        .connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('Mongo connected successfully'))
        .catch((e) => {
            console.log(e.message);
        });
};

connectDB();
