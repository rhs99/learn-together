const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: mongoose.Types.ObjectId, ref: 'Class' },
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
