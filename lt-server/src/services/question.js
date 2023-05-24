const mongoose = require('mongoose');
const Question = require('../models/question');

const addNewQuestion = async (body) => {
    try {
        let question;
        if (body._id !== '') {
            question = await Question.findOne({ _id: body._id }).exec();
            if (JSON.stringify(question.user) !== JSON.stringify(body.user)) {
                throw new Error('unauthorized');
            }
            question.details = body.details;
            question.imageLocations = body.imageLocations;
            question.tags = body.tags;
        } else {
            delete body._id;
            question = new Question(body);
        }
        await question.save();
    } catch (e) {
        console.log(e.message);
        if (e.message === 'unauthorized') {
            throw new Error();
        }
    }
};

const getAllQuestions = async (body, query) => {
    try {
        let q = { chapter: new mongoose.Types.ObjectId(body.chapterId) };
        if (body.tagIds && body.tagIds.length > 0) {
            q.tags = { $in: body.tagIds.map((_id) => new mongoose.Types.ObjectId(_id)) };
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

        const sort = { [key]: val };

        const questions = await Question.aggregate([
            {
                $match: q,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $lookup: {
                    from: 'tags',
                    localField: 'tags',
                    foreignField: '_id',
                    as: 'tags',
                },
            },
            {
                $addFields: {
                    vote: { $subtract: ['$upVote', '$downVote'] },
                },
            },
            {
                $unwind: '$user',
            },
            {
                $sort: sort,
            },
        ]).exec();

        return questions;
    } catch (e) {
        console.log(e.message);
    }
};

const getQuestion = async (questionId) => {
    try {
        const question = await Question.findOne({ _id: questionId }).populate('tags').populate('user').exec();
        return question;
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = { addNewQuestion, getAllQuestions, getQuestion };
