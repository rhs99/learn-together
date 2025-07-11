const { z } = require('zod');
const mongoose = require('mongoose');

// Schema for GET /api/tags (query parameters)
const getTagsSchema = {
    query: z
        .object({
            chapterId: z
                .string({ required_error: 'Chapter ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid ObjectId format',
                }),
        })
        .strict(),
};

// Schema for POST /api/tags (request body)
const createTagSchema = {
    body: z
        .object({
            name: z
                .string({ required_error: 'Tag name is required' })
                .min(1, { message: 'Tag name is required' })
                .max(50, { message: 'Tag name cannot exceed 50 characters' })
                .refine((value) => /^[a-zA-Z0-9\s-]+$/.test(value), {
                    message: 'Tag name can only contain letters, numbers, spaces, and hyphens',
                }),
            chapter: z
                .string({ required_error: 'Chapter ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid ObjectId format',
                }),
        })
        .strict(),
};

module.exports = {
    getTagsSchema,
    createTagSchema,
};
