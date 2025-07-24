const Vote = require('../models/vote');
const Question = require('../models/question');
const Answer = require('../models/answer');
const { NotFoundError } = require('../common/error');

const updateVote = async (body) => {
    let vote = await Vote.findOne({ qa: body.qaId, user: body.user, isQuestion: body.q }).exec();

    const model = body.q ? Question : Answer;
    let qa = await model.findOne({ _id: body.qaId }).exec();
    if (!qa) {
        throw new NotFoundError(`${body.q ? 'Question' : 'Answer'} not found for id: ${body.qaId}`);
    }

    if (!vote) {
        vote = new Vote({ qa: body.qaId, user: body.user, isQuestion: body.q });
    }

    if (body.up && vote.count !== 1) {
        vote.count += 1;
        if (vote.count === 0) {
            qa.downVote -= 1;
        } else {
            qa.upVote += 1;
        }
    } else if (!body.up && vote.count !== -1) {
        vote.count -= 1;
        if (vote.count === 0) {
            qa.upVote -= 1;
        } else {
            qa.downVote += 1;
        }
    }

    qa = await qa.save();
    vote = await vote.save();

    return { upVote: qa.upVote, downVote: qa.downVote };
};

module.exports = { updateVote };
