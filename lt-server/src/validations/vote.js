const { z } = require('zod');
const mongoose = require('mongoose');

// Schema for POST /update (request body) - updateVote
const updateVoteSchema = {
    body: z
        .object({
            qaId: z
                .string({ required_error: 'Question/Answer ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Question/Answer ObjectId format',
                }),
            q: z
                .boolean({ required_error: 'Question flag is required' })
                .refine((val) => typeof val === 'boolean', {
                    message: 'Question flag must be a boolean (true for question, false for answer)',
                }),
            up: z
                .boolean({ required_error: 'Vote direction is required' })
                .refine((val) => typeof val === 'boolean', {
                    message: 'Vote direction must be a boolean (true for upvote, false for downvote)',
                }),
        })
        .strict(),
};

module.exports = {
    updateVoteSchema,
};
