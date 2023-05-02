const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    class: { type: mongoose.Types.ObjectId, ref: 'Class' },
});

subjectSchema.index({ name: 1, class: 1 }, { unique: true });
subjectSchema.plugin(uniqueValidator);

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
