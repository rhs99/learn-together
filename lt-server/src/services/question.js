const mongoose = require('mongoose');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Chapter = require('../models/chapter');
const User = require('../models/user');

const addNewQuestion = async (body) => {
    try {
        const user = await User.findById(body.user).exec();

        if (body._id !== '') {
            const question = await Question.findOne({ _id: body._id }).exec();
            if (question.userName !== user.userName) {
                throw new Error('unauth');
            }
            question.details = body.details;
            question.imageLocations = body.imageLocations;
            question.tags = body.tags;
            await question.save();
            return;
        }

        delete body._id;
        delete body.user;
        body.userName = user.userName;

        let question = new Question(body);
        question = await question.save();

        user.questions.push(question._id);
        await user.save();
        const chapter = await Chapter.findById(body.chapter).exec();
        chapter.questions.push(question._id);
        await chapter.save();
    } catch (e) {
        console.log(e.message);
        if (e.message === 'unauth') {
            throw new Error();
        }
    }
};

const getAllQuestions = async (body, query) => {
    const pageNumber = query.pageNumber || 1;
    const pageSize = query.pageSize || 5;

    try {
        const chapter = await Chapter.findById(body.chapterId).exec();
        let tagIds = [];

        if (body.tagIds && body.tagIds.length > 0) {
            tagIds = body.tagIds.map((_id) => new mongoose.Types.ObjectId(_id));
        }

        let key = 'createdAt',
            val = -1;

        if (query.sortBy && query.sortOrder) {
            switch (query.sortBy) {
                case 'upVote':
                    key = 'upVote';
                    break;
                case 'downVote':
                    key = 'downVote';
                    break;
                case 'time':
                    key = 'createdAt';
                    break;
                case 'vote':
                    key = 'vote';
                    break;
            }
            switch (query.sortOrder) {
                case 'desc':
                    val = -1;
                    break;
                case 'asc':
                    val = 1;
                    break;
            }
        }

        const sortOption = { [key]: val };

        const q = { _id: { $in: chapter.questions } };

        if (tagIds.length > 0) {
            q['tags._id'] = { $in: tagIds };
        }

        const allQuestions = await Question.find(q)
            .sort(sortOption)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();
        return { totalCount: chapter.questions.length, paginatedResults: allQuestions };
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};

const getQuestion = async (questionId) => {
    try {
        const question = await Question.findOne({ _id: questionId }).exec();
        return question;
    } catch (e) {
        console.log(e.message);
        throw new Error(e);
    }
};

const deleteQuestion = async (questionId, userId) => {
    try {
        const user = await User.findById(userId).exec();
        const question = await Question.findById(questionId).exec();
        if (question.userName !== user.userName) {
            throw new Error('unauth');
        }
        const promises = question.answers.map((_id) => {
            return Answer.deleteOne({ _id: _id }).exec();
        });
        await Promise.all(promises);

        const chapter = await Chapter.findById(question.chapter).exec();
        chapter.questions = chapter.questions.filter((item) => JSON.stringify(item) !== JSON.stringify(questionId));
        await chapter.save();
        user.questions = user.questions.filter((item) => JSON.stringify(item) !== JSON.stringify(questionId));
        await user.save();
        await Question.deleteOne({ _id: questionId }).exec();
    } catch (e) {
        console.log(e.message);
        if (e.message === 'unauth') {
            throw new Error();
        }
    }
};

module.exports = { addNewQuestion, getAllQuestions, getQuestion, deleteQuestion };
