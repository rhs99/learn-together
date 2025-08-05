const { z } = require('zod');
const mongoose = require('mongoose');

// Schema for GET /:_id (path parameters)
const getQuestionSchema = {
    params: z
        .object({
            _id: z
                .string({ required_error: 'Question ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Question ObjectId format',
                }),
        })
        .strict(),
};

// Schema for POST /search (request body) - getAllQuestions
const getAllQuestionsSchema = {
    body: z
        .object({
            chapterId: z
                .string({ required_error: 'Chapter ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Chapter ObjectId format',
                }),
            tagIds: z
                .array(
                    z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
                        message: 'Invalid Tag ObjectId format',
                    }),
                )
                .optional(),
        })
        .strict(),
    query: z
        .object({
            pageNumber: z
                .string()
                .optional()
                .refine((val) => !val || (!isNaN(parseInt(val)) && parseInt(val) > 0), {
                    message: 'Page number must be a positive integer',
                }),
            pageSize: z
                .string()
                .optional()
                .refine((val) => !val || (!isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) <= 10), {
                    message: 'Page size must be a positive integer between 1 and 10',
                }),
            sortBy: z.enum(['upVote', 'downVote', 'time', 'vote']).optional(),
            sortOrder: z.enum(['asc', 'desc']).optional(),
            filterBy: z.enum(['all', 'favourite', 'mine']).optional(),
        })
        .strict(),
};

// Schema for POST / (request body) - addNewQuestion
const addNewQuestionSchema = {
    body: z
        .object({
            _id: z
                .string()
                .optional()
                .refine((id) => !id || id === '' || mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Question ObjectId format',
                }),
            details: z
                .any({ required_error: 'Question details are required' })
                .refine((details) => details !== null && details !== undefined, {
                    message: 'Question details cannot be null or undefined',
                }),
            chapter: z
                .string({ required_error: 'Chapter ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Chapter ObjectId format',
                }),
            tags: z
                .array(
                    z.object({
                        _id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
                            message: 'Invalid Tag ObjectId format',
                        }),
                        name: z.string().min(1, { message: 'Tag name is required' }),
                    }),
                )
                .optional(),
            imageLocations: z.array(z.string()).optional(),
        })
        .strict(),
};

// Schema for DELETE /:_id (path parameters)
const deleteQuestionSchema = {
    params: z
        .object({
            _id: z
                .string({ required_error: 'Question ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Question ObjectId format',
                }),
        })
        .strict(),
};

// Schema for POST /favourite (request body) - addToFavourite
const addToFavouriteSchema = {
    body: z
        .object({
            questionId: z
                .string({ required_error: 'Question ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Question ObjectId format',
                }),
        })
        .strict(),
};

module.exports = {
    getQuestionSchema,
    getAllQuestionsSchema,
    addNewQuestionSchema,
    deleteQuestionSchema,
    addToFavouriteSchema,
};
