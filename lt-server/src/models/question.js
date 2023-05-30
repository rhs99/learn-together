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
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        chapter: {
            type: mongoose.Types.ObjectId,
            ref: 'Chapter',
            required: true,
        },
        tags: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Tag',
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
            },
        ],
    },
    { timestamps: true },
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
