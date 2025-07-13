const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    class: { type: mongoose.Types.ObjectId, ref: 'Class', required: true },
    chapters: [{ type: mongoose.Types.ObjectId, ref: 'Chapter' }],
});

subjectSchema.index({ name: 1, class: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
