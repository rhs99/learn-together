const { z } = require('zod');
const mongoose = require('mongoose');

// Schema for GET /:_id/breadcrumb (path parameters)
const getSubjectBreadcrumbSchema = {
    params: z
        .object({
            _id: z
                .string({ required_error: 'Subject ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid ObjectId format',
                }),
        })
        .strict(),
};

// Schema for GET / (query parameters)
const getSubjectsSchema = {
    query: z
        .object({
            classId: z
                .string({ required_error: 'Class ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid ObjectId format',
                }),
        })
        .strict(),
};

// Schema for POST / (request body)
const createSubjectSchema = {
    body: z
        .object({
            name: z
                .string({ required_error: 'Subject name is required' })
                .min(1, { message: 'Subject name is required' })
                .max(200, { message: 'Subject name cannot exceed 200 characters' }),
            class: z
                .string({ required_error: 'Class ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Class ObjectId format',
                }),
            chapters: z
                .array(
                    z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
                        message: 'Invalid Chapter ObjectId format',
                    }),
                )
                .optional(),
        })
        .strict(),
};

module.exports = {
    getSubjectBreadcrumbSchema,
    getSubjectsSchema,
    createSubjectSchema,
};
