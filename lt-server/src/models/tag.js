const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
});
tagSchema.plugin(uniqueValidator);

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
