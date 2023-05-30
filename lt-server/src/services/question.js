const mongoose = require('mongoose');
const Question = require('../models/question');
const Answer = require('../models/answer');

const addNewQuestion = async (body) => {
    try {
        let question;
        if (body._id !== '') {
            question = await Question.findOne({ _id: body._id }).exec();
            if (JSON.stringify(question.user) !== JSON.stringify(body.user)) {
                throw new Error('unauth');
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
        if (e.message === 'unauth') {
            throw new Error();
        }
    }
};

const getAllQuestions = async (body, query) => {
    const pageNumber = query.pageNumber || 1;
    const pageSize = query.pageSize || 5;

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

    try {
        const results = await Question.aggregate([
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
            {
                $facet: {
                    totalCount: [{ $count: 'total' }],
                    paginatedResults: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize }],
                },
            },
        ]).exec();
        const totalCount = results[0].totalCount[0].total;
        const paginatedResults = results[0].paginatedResults;

        return { totalCount, paginatedResults };
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

const deleteQuestion = async (questionId, user) => {
    try {
        const question = await Question.findById(questionId).exec();
        if (JSON.stringify(question.user) !== JSON.stringify(user)) {
            throw new Error('unauth');
        }
        const promises = question.answers.map((_id) => {
            return Answer.deleteOne({ _id: _id }).exec();
        });
        await Question.deleteOne({ _id: questionId }).exec();
        await Promise.all(promises);
    } catch (e) {
        console.log(e.message);
        if (e.message === 'unauth') {
            throw new Error();
        }
    }
};

module.exports = { addNewQuestion, getAllQuestions, getQuestion, deleteQuestion };
