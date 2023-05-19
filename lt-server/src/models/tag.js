const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true },
    chapter: { type: mongoose.Types.ObjectId, ref: 'Chapter', required: true },
    isDeleted: { type: Boolean, default: false },
});

tagSchema.index({ name: 1, chapter: 1 }, { unique: true });

tagSchema.pre('save', function (next) {
    let name = this.name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = name.trim().split(/\s+/).join('-');
    this.name = name;
    return next();
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
