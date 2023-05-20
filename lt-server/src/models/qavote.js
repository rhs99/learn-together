const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema({
    qaId: { type: mongoose.Types.ObjectId, required: true },
    uId: { type: mongoose.Types.ObjectId, required: true },
    q: { type: Boolean, required: true },
    cnt: { type: Number, default: 0, required: true },
});

qaSchema.index({ qaId: 1, uId: 1 }, { unique: true });

const QAVote = mongoose.model('QAVote', qaSchema);

module.exports = QAVote;
