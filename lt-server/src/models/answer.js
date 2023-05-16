const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
    {
        details: {
            type: String,
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
        },
        question: {
            type: mongoose.Types.ObjectId,
            ref: 'Question',
        },
        imageLocations: [
            {
                type: String,
            },
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
