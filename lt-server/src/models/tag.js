const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true },
    question: { type: mongoose.Types.ObjectId, ref: 'Question' },
    isDeleted: { type: Boolean, default: false },
});

tagSchema.index({ name: 1, subject: 1 }, { unique: true });
tagSchema.plugin(uniqueValidator);

const Tag = mongoose.model('Chapter', tagSchema);

module.exports = Tag;
