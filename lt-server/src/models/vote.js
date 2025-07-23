const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    qa: { type: mongoose.Types.ObjectId, required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    isQuestion: { type: Boolean, required: true },
    count: { type: Number, default: 0, required: true },
});

voteSchema.index({ qa: 1, user: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
