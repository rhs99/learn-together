const mongoose = require('mongoose');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Chapter = require('../models/chapter');
const User = require('../models/user');
const Utils = require('../common/utils');
const { clearCache } = require('./cache');

const addNewQuestion = async (body) => {
    const user = await User.findById(body.user).exec();

    body.imageLocations = body.imageLocations || [];
    body.tags = body.tags || [];

    if (body._id !== '') {
        const question = await Question.findOne({ _id: body._id }).exec();
        if (question.userName !== user.userName) {
            throw new Error('unauth');
        }
        if (question.imageLocations.length > 0 && body.imageLocations.length > 0) {
            Utils.deleteFile(question.imageLocations);
        }

        question.details = body.details || question.details;
        question.imageLocations = body.imageLocations.length === 0 ? question.imageLocations : body.imageLocations;
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
    clearCache(`chapters-${chapter.subject}`);
};

const getAllQuestions = async (body, query) => {
    const pageNumber = query.pageNumber || 1;
    let pageSize = query.pageSize || 10;
    if (pageSize > 10) {
        pageSize = 10;
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
    const filterBy = query.filterBy || 'all';

    let user = null;
    if (body.user) {
        user = await User.findById(body.user).exec();
    }

    const chapter = await Chapter.findById(body.chapterId).exec();
    let tagIds = [];

    if (body.tagIds && body.tagIds.length > 0) {
        tagIds = body.tagIds.map((_id) => new mongoose.Types.ObjectId(_id));
    }

    let q = { _id: { $in: chapter.questions } };

    if (filterBy === 'favourite') {
        q = { $and: [{ _id: { $in: chapter.questions } }, { _id: { $in: user.favourites } }] };
    } else if (filterBy === 'mine') {
        q['userName'] = { $eq: user.userName };
    }

    if (tagIds.length > 0) {
        q['tags._id'] = { $in: tagIds };
    }

    const totalFilteredCount = await Question.countDocuments(q).exec();

    const allQuestions = await Question.find(q)
        .sort(sortOption)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec();

    const searchResponse = allQuestions.map((question) => {
        question.imageLocations = question.imageLocations.map((fileName) => {
            return Utils.getFileUrl(fileName);
        });

        if (filterBy === 'favourite') {
            return {
                ...question._doc,
                isFavourite: true,
            };
        }
        const isPresent = user
            ? user.favourites.some((questionId) => JSON.stringify(questionId) === JSON.stringify(question._id))
            : false;
        return {
            ...question._doc,
            isFavourite: isPresent,
        };
    });

    return { totalCount: totalFilteredCount, paginatedResults: searchResponse };
};

const getQuestion = async (questionId) => {
    const question = await Question.findOne({ _id: questionId }).exec();
    question.imageLocations = question.imageLocations.map((fileName) => {
        return Utils.getFileUrl(fileName);
    });
    return question;
};

const deleteQuestion = async (questionId, userId) => {
    const user = await User.findById(userId).exec();
    const question = await Question.findById(questionId).exec();
    if (question.userName !== user.userName) {
        throw new Error('unauth');
    }
    const allFiles = question.imageLocations;
    const promises = question.answers.map((_id) => {
        return Answer.findOneAndDelete({ _id: _id }).exec();
    });
    const answers = await Promise.all(promises);
    answers.forEach((answer) => {
        allFiles.push(...answer.imageLocations);
    });
    const chapter = await Chapter.findById(question.chapter).exec();
    chapter.questions = chapter.questions.filter((item) => JSON.stringify(item) !== JSON.stringify(questionId));
    await chapter.save();
    user.questions = user.questions.filter((item) => JSON.stringify(item) !== JSON.stringify(questionId));
    await user.save();
    await Question.deleteOne({ _id: questionId }).exec();
    if (allFiles.length > 0) {
        Utils.deleteFile(allFiles);
    }
    clearCache(`chapters-${chapter.subject}`);
};

const addToFavourite = async (body) => {
    const user = await User.findById(body.user).exec();
    const isPresent = user.favourites.some(
        (questionId) => JSON.stringify(questionId) === JSON.stringify(body.questionId),
    );
    if (!isPresent) {
        user.favourites.push(body.questionId);
    } else {
        user.favourites = user.favourites.filter(
            (questionId) => JSON.stringify(questionId) !== JSON.stringify(body.questionId),
        );
    }
    await user.save();
    return { favourite: !isPresent };
};

module.exports = { addNewQuestion, getAllQuestions, getQuestion, deleteQuestion, addToFavourite };
