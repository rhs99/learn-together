const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['new_answer', 'upvote', 'downvote'],
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
});

notificationSchema.index({ userId: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
