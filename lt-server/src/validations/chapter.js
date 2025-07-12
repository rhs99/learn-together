const { z } = require('zod');
const mongoose = require('mongoose');

// Schema for GET /:_id/breadcrumb (path parameters)
const getChapterBreadcrumbSchema = {
    params: z
        .object({
            _id: z
                .string({ required_error: 'Chapter ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid ObjectId format',
                }),
        })
        .strict(),
};

// Schema for GET / (query parameters)
const getChaptersSchema = {
    query: z
        .object({
            subjectId: z
                .string({ required_error: 'Subject ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid ObjectId format',
                }),
        })
        .strict(),
};

// Schema for POST / (request body)
const createChapterSchema = {
    body: z
        .object({
            name: z
                .string({ required_error: 'Chapter name is required' })
                .min(1, { message: 'Chapter name is required' })
                .max(200, { message: 'Chapter name cannot exceed 200 characters' }),
            subject: z
                .string({ required_error: 'Subject ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Subject ObjectId format',
                }),
            questions: z
                .array(
                    z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
                        message: 'Invalid Question ObjectId format',
                    }),
                )
                .optional(),
        })
        .strict(),
};

module.exports = {
    getChapterBreadcrumbSchema,
    getChaptersSchema,
    createChapterSchema,
};
