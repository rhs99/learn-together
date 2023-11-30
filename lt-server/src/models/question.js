const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        details: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        upVote: {
            type: Number,
            default: 0,
        },
        downVote: {
            type: Number,
            default: 0,
        },
        vote: {
            type: Number,
            default: 0,
        },
        userName: {
            type: String,
            required: true,
        },
        chapter: {
            type: mongoose.Types.ObjectId,
            ref: 'Chapter',
            required: true,
        },
        tags: [
            {
                _id: mongoose.Types.ObjectId,
                name: String,
            },
        ],
        imageLocations: [
            {
                type: String,
            },
        ],
        answers: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Answer',
            },
        ],
    },
    { timestamps: true },
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
