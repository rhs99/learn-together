const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const privilegeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});
privilegeSchema.plugin(uniqueValidator);

const Privilege = mongoose.model('Privilege', privilegeSchema);

module.exports = Privilege;
