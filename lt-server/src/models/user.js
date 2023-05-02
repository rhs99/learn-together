const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    privileges: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Privilege',
        },
    ],
    class: {
        type: mongoose.Types.ObjectId,
        ref: 'Class',
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    return next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    const user = this;
    return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
