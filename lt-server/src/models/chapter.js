const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const chapterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: mongoose.Types.ObjectId, ref: 'Subject' },
    isDeleted: { type: Boolean, default: false },
});

chapterSchema.index({ name: 1, subject: 1 }, { unique: true });
chapterSchema.plugin(uniqueValidator);

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
