const mongoose = require('mongoose');

const privilegeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

const Privilege = mongoose.model('Privilege', privilegeSchema);

module.exports = Privilege;
