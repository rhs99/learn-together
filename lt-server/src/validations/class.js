const { z } = require('zod');
const mongoose = require('mongoose');

// Schema for GET /:_id (path parameters)
const getClassSchema = {
    params: z
        .object({
            _id: z
                .string({ required_error: 'Class ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid ObjectId format',
                }),
        })
        .strict(),
};

// Schema for GET / (no validation needed as it doesn't have parameters)
const getClassesSchema = {};

// Schema for POST /api/classes (request body)
const createClassSchema = {
    body: z
        .object({
            name: z
                .string({ required_error: 'Class name is required' })
                .min(1, { message: 'Class name is required' })
                .max(100, { message: 'Class name cannot exceed 100 characters' }),
            subjects: z
                .array(
                    z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
                        message: 'Invalid Subject ObjectId format',
                    }),
                )
                .optional(),
        })
        .strict(),
};

module.exports = {
    getClassSchema,
    getClassesSchema,
    createClassSchema,
};
