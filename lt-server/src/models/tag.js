const mongoose = require('mongoose');

const { formatTagName } = require('../common/utils');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true },
    chapter: { type: mongoose.Types.ObjectId, ref: 'Chapter', required: true },
});

tagSchema.index({ name: 1, chapter: 1 }, { unique: true });

tagSchema.pre('save', function (next) {
    this.name = formatTagName(this.name);
    return next();
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
