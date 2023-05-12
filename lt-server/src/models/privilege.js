const mongoose = require('mongoose');

const privilegeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
});

const Privilege = mongoose.model('Privilege', privilegeSchema);

module.exports = Privilege;
