const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
    subjects : [{type: mongoose.Types.ObjectId, ref: 'Subject'}]
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
