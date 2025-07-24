const mongoose = require('mongoose');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Chapter = require('../models/chapter');
const User = require('../models/user');
const Utils = require('../common/utils');

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 10;

const SORT_FIELDS = {
    upVote: 'upVote',
    downVote: 'downVote',
    time: 'createdAt',
    vote: 'voteDifference',
};

const SORT_ORDERS = {
    asc: 1,
    desc: -1,
};

const FILTER_TYPES = {
    all: 'all',
    favourite: 'favourite',
    mine: 'mine',
};

const compareObjectIds = (id1, id2) => {
    return String(id1) === String(id2);
};

const normalizeImageLocations = (imageLocations = []) => {
    return imageLocations.map((fileName) => Utils.getFileUrl(fileName));
};

const createSortStage = (sortBy, sortOrder) => {
    const field = SORT_FIELDS[sortBy] || 'createdAt';
    const order = SORT_ORDERS[sortOrder] || SORT_ORDERS.desc;
    return { [field]: order };
};

const buildMatchStage = (chapterQuestions, filterBy, user, tagIds) => {
    const baseMatch = { _id: { $in: chapterQuestions } };

    switch (filterBy) {
        case FILTER_TYPES.favourite:
            if (!user) throw new Error('User required for favourite filter');
            return {
                $and: [baseMatch, { _id: { $in: user.favourites } }],
            };

        case FILTER_TYPES.mine:
            if (!user) throw new Error('User required for mine filter');
            return { ...baseMatch, userName: user.userName };

        default:
            return tagIds.length > 0 ? { ...baseMatch, 'tags._id': { $in: tagIds } } : baseMatch;
    }
};

const enrichQuestionWithFavouriteStatus = (question, user, filterBy) => {
    const isFavourite =
        filterBy === FILTER_TYPES.favourite ||
        (user && user.favourites.some((favId) => compareObjectIds(favId, question._id)));

    return {
        ...question,
        isFavourite,
        imageLocations: normalizeImageLocations(question.imageLocations),
    };
};

const addNewQuestion = async (body) => {
    const user = await User.findById(body.user).exec();
    if (!user) throw new Error('User not found');

    body.imageLocations = body.imageLocations || [];
    body.tags = body.tags || [];

    if (body._id && body._id !== '') {
        return await updateExistingQuestion(body, user);
    }

    return await createNewQuestion(body, user);
};

const updateExistingQuestion = async (body, user) => {
    const question = await Question.findById(body._id).exec();
    if (!question) throw new Error('Question not found');

    if (question.userName !== user.userName) {
        throw new Error('Unauthorized: You can only edit your own questions');
    }

    if (question.imageLocations.length > 0 && body.imageLocations.length > 0) {
        Utils.deleteFile(question.imageLocations);
    }

    question.details = body.details || question.details;
    question.imageLocations = body.imageLocations.length === 0 ? question.imageLocations : body.imageLocations;
    question.tags = body.tags;

    await question.save();
};

const createNewQuestion = async (body, user) => {
    const questionData = {
        ...body,
        userName: user.userName,
        _id: undefined,
        user: undefined,
    };

    const question = new Question(questionData);
    const savedQuestion = await question.save();

    await Promise.all([
        User.findByIdAndUpdate(user._id, { $push: { questions: savedQuestion._id } }),
        Chapter.findByIdAndUpdate(body.chapter, { $push: { questions: savedQuestion._id } }),
    ]);

    return savedQuestion;
};

const getAllQuestions = async (body, query) => {
    const pageNumber = Math.max(parseInt(query.pageNumber) || DEFAULT_PAGE_NUMBER, 1);
    const pageSize = Math.min(parseInt(query.pageSize) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

    const filterBy = query.filterBy || FILTER_TYPES.all;

    const [user, chapter] = await Promise.all([
        body.user ? User.findById(body.user).exec() : null,
        Chapter.findById(body.chapterId).exec(),
    ]);

    if (!chapter) throw new Error('Chapter not found');

    const tagIds = (body.tagIds || []).map((id) => new mongoose.Types.ObjectId(id));

    const pipeline = buildAggregationPipeline({
        chapterQuestions: chapter.questions,
        filterBy,
        user,
        tagIds,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        pageNumber,
        pageSize,
    });

    const [result] = await Question.aggregate(pipeline).exec();

    const totalCount = result?.metadata[0]?.totalCount || 0;
    const questions = result?.data || [];

    const paginatedResults = questions.map((question) => enrichQuestionWithFavouriteStatus(question, user, filterBy));

    return { totalCount, paginatedResults };
};

const buildAggregationPipeline = ({
    chapterQuestions,
    filterBy,
    user,
    tagIds,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
}) => {
    const matchStage = buildMatchStage(chapterQuestions, filterBy, user, tagIds);
    const sortStage = createSortStage(sortBy, sortOrder);
    const skipAmount = (pageNumber - 1) * pageSize;

    const pipeline = [{ $match: matchStage }];

    if (sortBy === 'vote') {
        pipeline.push({
            $addFields: {
                voteDifference: { $subtract: ['$upVote', '$downVote'] },
            },
        });
    }

    pipeline.push(
        { $sort: sortStage },
        {
            $facet: {
                metadata: [{ $count: 'totalCount' }],
                data: [{ $skip: skipAmount }, { $limit: pageSize }],
            },
        },
    );

    return pipeline;
};

const getQuestion = async (questionId) => {
    const question = await Question.findById(questionId).exec();
    if (!question) throw new Error('Question not found');

    return {
        ...question.toObject(),
        imageLocations: normalizeImageLocations(question.imageLocations),
    };
};

const deleteQuestion = async (questionId, userId) => {
    const [user, question] = await Promise.all([User.findById(userId).exec(), Question.findById(questionId).exec()]);

    if (!user || !question) {
        throw new Error('User or question not found');
    }

    if (question.userName !== user.userName) {
        throw new Error('Unauthorized: You can only delete your own questions');
    }

    const filesToDelete = [...question.imageLocations];

    if (question.answers.length > 0) {
        const deletedAnswers = await Promise.all(
            question.answers.map((answerId) => Answer.findByIdAndDelete(answerId).exec()),
        );

        deletedAnswers.forEach((answer) => {
            if (answer?.imageLocations) {
                filesToDelete.push(...answer.imageLocations);
            }
        });
    }

    await Promise.all([
        Chapter.findByIdAndUpdate(question.chapter, { $pull: { questions: questionId } }),
        User.findByIdAndUpdate(userId, { $pull: { questions: questionId } }),
    ]);

    await Question.deleteOne({ _id: questionId }).exec();

    if (filesToDelete.length > 0) {
        Utils.deleteFile(filesToDelete);
    }
};

const addToFavourite = async (body) => {
    const { user: userId, questionId } = body;

    if (!userId || !questionId) {
        throw new Error('User ID and Question ID are required');
    }

    const user = await User.findById(userId).exec();
    if (!user) throw new Error('User not found');

    const isFavourite = user.favourites.some((favId) => compareObjectIds(favId, questionId));

    if (isFavourite) {
        user.favourites = user.favourites.filter((favId) => !compareObjectIds(favId, questionId));
    } else {
        user.favourites.push(questionId);
    }

    await user.save();

    return { favourite: !isFavourite };
};

module.exports = {
    addNewQuestion,
    getAllQuestions,
    getQuestion,
    deleteQuestion,
    addToFavourite,
};
