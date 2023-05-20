const QAVote = require('../models/qavote');
const Question = require('../models/question');
const Answer = require('../models/answer');

const updateVote = async (body) => {
    try {
        let vote = await QAVote.findOne({ qaId: body.qaId, uId: body.uId, q: body.q }).exec();
        const model = body.q ? Question : Answer;
        let qa = await model.findOne({ _id: body.qaId }).exec();

        if (!vote) {
            vote = new QAVote({ qaId: body.qaId, uId: body.uId, q: body.q });
        }

        if (body.up && vote.cnt !== 1) {
            vote.cnt += 1;
            if (vote.cnt === 0) {
                qa.downVote -= 1;
            } else {
                qa.upVote += 1;
            }
        } else if (!body.up && vote.cnt !== -1) {
            vote.cnt -= 1;
            if (vote.cnt === 0) {
                qa.upVote -= 1;
            } else {
                qa.downVote += 1;
            }
        }

        qa = await qa.save();
        vote = await vote.save();

        return qa.upVote - qa.downVote;
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = { updateVote };
