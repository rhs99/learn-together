const { z } = require('zod');
const mongoose = require('mongoose');

// Schema for PATCH /:id (path parameters and request body)
const patchDonationSchema = {
    params: z
        .object({
            id: z
                .string({ required_error: 'Donation ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Donation ObjectId format',
                }),
        })
        .strict(),
    body: z
        .object({
            status: z
                .enum(['pending', 'completed'], {
                    required_error: 'Status is required',
                    invalid_type_error: 'Status must be either "pending" or "completed"',
                })
                .optional(),
        })
        .strict(),
};

module.exports = {
    patchDonationSchema,
};
