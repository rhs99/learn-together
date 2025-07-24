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
        userName: {
            type: String,
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

answerSchema.virtual('vote').get(function () {
    return (this.upVote || 0) - (this.downVote || 0);
});
answerSchema.set('toObject', { virtuals: true });
answerSchema.set('toJSON', { virtuals: true });

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
