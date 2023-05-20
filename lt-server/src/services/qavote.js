const QAVote = require('../models/qavote');
const Question = require('../models/question');
const Answer = require('../models/answer');

const updateVote = async (body) => {
    try {
        let vote = await QAVote.findOne({ qaId: body.qaId, uId: body.uId, q: body.q }).exec();
        let delta = 0;
        let isNew = false;
        if (vote) {
            if (body.up !== vote.up) {
                vote.up = body.up;
                delta = body.up ? 1 : -1;
            }
        } else {
            vote = new QAVote(body);
            delta = body.up ? 1 : -1;
            isNew = true;
        }
        const model = body.q ? Question : Answer;
        let val = await model.findOne({ _id: body.qaId }).exec();

        if (delta !== 0) {
            if (body.up) {
                val.upVote += 1;
                if (!isNew) val.downVote -= 1;
            } else {
                if (!isNew) val.upVote -= 1;
                val.downVote += 1;
            }
            val = await val.save();
        }
        await vote.save();
        return val.upVote - val.downVote;
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = { updateVote };
