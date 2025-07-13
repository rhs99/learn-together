const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: mongoose.Types.ObjectId, ref: 'Subject', required: true },
    questions: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Question',
        },
    ],
});

chapterSchema.index({ name: 1, subject: 1 }, { unique: true });

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
