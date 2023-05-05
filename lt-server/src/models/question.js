const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
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
        chapter: {
            type: mongoose.Types.ObjectId,
            ref: 'Chapter',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;