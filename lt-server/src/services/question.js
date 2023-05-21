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

const getAllQuestions = async (chapterId) => {
    try {
        const questions = await Question.find({ chapter: chapterId, isDeleted: false })
            .populate('tags')
            .populate('user')
            .exec();
        return questions;
    } catch (e) {
        console.log(e.message);
    }
};

const getQuestion = async (questionId) => {
    try {
        const question = await Question.findOne({ _id: questionId, isDeleted: false })
            .populate('tags')
            .populate('user')
            .exec();
        return question;
    } catch (e) {
        console.log(e.message);
    }
};

const softDeleteQuestion = async (_id) => {
    try {
        const question = await Question.findOneAndUpdate(
            { _id },
            { isDeleted: true },
            {
                new: true,
            },
        );
        return question;
    } catch (e) {
        if (e instanceof Error) console.log(e.message);
    }
};

module.exports = { addNewQuestion, getAllQuestions, softDeleteQuestion, getQuestion };
