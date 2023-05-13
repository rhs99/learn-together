const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true},
    chapter: { type: mongoose.Types.ObjectId, ref: 'Chapter', required: true},
    isDeleted: { type: Boolean, default: false },
});

tagSchema.index({ name: 1, chapter: 1 }, { unique: true });

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
