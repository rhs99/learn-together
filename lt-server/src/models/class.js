const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const classSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
});
classSchema.plugin(uniqueValidator);

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
