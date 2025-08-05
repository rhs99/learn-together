const Vote = require('../models/vote');
const Question = require('../models/question');
const Answer = require('../models/answer');
const { NotFoundError } = require('../common/error');
const logger = require('../config/logger');

const updateVote = async (body) => {
    logger.database('Querying vote', 'votes', { qaId: body.qaId, userId: body.user, isQuestion: body.q });
    let vote = await Vote.findOne({ qa: body.qaId, user: body.user, isQuestion: body.q }).exec();

    const model = body.q ? Question : Answer;
    logger.database('Querying Q/A', body.q ? 'questions' : 'answers', { qaId: body.qaId });
    let qa = await model.findOne({ _id: body.qaId }).exec();
    if (!qa) {
        logger.warn('Vote update failed - Q/A not found', {
            qaId: body.qaId,
            isQuestion: body.q,
        });
        throw new NotFoundError(`${body.q ? 'Question' : 'Answer'} not found for id: ${body.qaId}`);
    }

    const isNewVote = !vote;
    if (!vote) {
        logger.debug('Creating new vote record', { qaId: body.qaId, userId: body.user });
        vote = new Vote({ qa: body.qaId, user: body.user, isQuestion: body.q });
    }

    const oldCount = vote.count;
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

    logger.database('Updating Q/A vote counts', body.q ? 'questions' : 'answers', {
        qaId: body.qaId,
        oldUpVotes: qa.upVote - (vote.count > oldCount ? 1 : 0),
        newUpVotes: qa.upVote,
        oldDownVotes: qa.downVote - (vote.count < oldCount ? 1 : 0),
        newDownVotes: qa.downVote,
    });

    qa = await qa.save();
    vote = await vote.save();

    logger.debug('Vote updated successfully', {
        qaId: body.qaId,
        userId: body.user,
        voteChange: `${oldCount} -> ${vote.count}`,
        isNewVote,
        finalCounts: { upVote: qa.upVote, downVote: qa.downVote },
    });

    return { upVote: qa.upVote, downVote: qa.downVote };
};

module.exports = { updateVote };
