const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
    {
        details: {
            type: mongoose.Schema.Types.Mixed,
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
        question: {
            type: mongoose.Types.ObjectId,
            ref: 'Question',
            required: true,
        },
        imageLocations: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true },
);

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
