const { z } = require('zod');
const mongoose = require('mongoose');

// Schema for GET /:_id (path parameters)
const getAnswerSchema = {
    params: z
        .object({
            _id: z
                .string({ required_error: 'Answer ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Answer ObjectId format',
                }),
        })
        .strict(),
};

// Schema for GET / (query parameters) - getAllAnswers
const getAllAnswersSchema = {
    query: z
        .object({
            questionId: z
                .string({ required_error: 'Question ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Question ObjectId format',
                }),
        })
        .strict(),
};

// Schema for POST / (request body) - addNewAnswer
const addNewAnswerSchema = {
    body: z
        .object({
            _id: z
                .string()
                .optional()
                .refine((id) => !id || id === '' || mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Answer ObjectId format',
                }),
            details: z
                .any({ required_error: 'Answer details are required' })
                .refine((details) => details !== null && details !== undefined, {
                    message: 'Answer details cannot be null or undefined',
                }),
            question: z
                .string({ required_error: 'Question ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Question ObjectId format',
                }),
            imageLocations: z.array(z.string()).optional(),
        })
        .strict(),
};

// Schema for DELETE /:_id (path parameters)
const deleteAnswerSchema = {
    params: z
        .object({
            _id: z
                .string({ required_error: 'Answer ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Answer ObjectId format',
                }),
        })
        .strict(),
};

module.exports = {
    getAnswerSchema,
    getAllAnswersSchema,
    addNewAnswerSchema,
    deleteAnswerSchema,
};
