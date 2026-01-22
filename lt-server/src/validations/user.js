const { z } = require('zod');
const mongoose = require('mongoose');

// Schema for GET /:userName (path parameters)
const getUserSchema = {
    params: z
        .object({
            userName: z
                .string({ required_error: 'Username is required' })
                .min(1, { message: 'Username cannot be empty' })
                .max(50, { message: 'Username cannot exceed 50 characters' }),
        })
        .strict(),
};

// Schema for GET /:userName/notifications (path parameters)
const getNotificationsSchema = {
    params: z
        .object({
            userName: z
                .string({ required_error: 'Username is required' })
                .min(1, { message: 'Username cannot be empty' })
                .max(50, { message: 'Username cannot exceed 50 characters' }),
        })
        .strict(),
};

// Schema for DELETE /:userName/notifications/:id (path parameters)
const removeNotificationSchema = {
    params: z
        .object({
            userName: z
                .string({ required_error: 'Username is required' })
                .min(1, { message: 'Username cannot be empty' })
                .max(50, { message: 'Username cannot exceed 50 characters' }),
            id: z
                .string({ required_error: 'Notification ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Notification ObjectId format',
                }),
        })
        .strict(),
};

// Schema for POST / (request body) - addNewUser
const addNewUserSchema = {
    body: z
        .object({
            userName: z
                .string({ required_error: 'Username is required' })
                .min(3, { message: 'Username must be at least 3 characters long' })
                .max(50, { message: 'Username cannot exceed 50 characters' })
                .regex(/^[a-zA-Z0-9_-]+$/, {
                    message: 'Username can only contain letters, numbers, underscores, and hyphens',
                }),
            email: z
                .string({ required_error: 'Email is required' })
                .email({ message: 'Invalid email format' })
                .max(100, { message: 'Email cannot exceed 100 characters' }),
            password: z
                .string({ required_error: 'Password is required' })
                .min(6, { message: 'Password must be at least 6 characters long' })
                .max(100, { message: 'Password cannot exceed 100 characters' }),
            class: z
                .string()
                .optional()
                .refine((id) => !id || id.trim() === '' || mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Class ObjectId format',
                }),
        })
        .strict(),
};

// Schema for POST /login (request body) - logInUser
const logInUserSchema = {
    body: z
        .object({
            userName: z
                .string({ required_error: 'Username is required' })
                .min(1, { message: 'Username cannot be empty' }),
            password: z
                .string({ required_error: 'Password is required' })
                .min(1, { message: 'Password cannot be empty' }),
        })
        .strict(),
};

// Schema for POST /forgot-password (request body)
const forgotPasswordSchema = {
    body: z
        .object({
            email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email format' }),
        })
        .strict(),
};

// Schema for POST /reset-password (request body)
const resetPasswordSchema = {
    body: z
        .object({
            userId: z
                .string({ required_error: 'User ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid User ObjectId format',
                }),
            token: z
                .string({ required_error: 'Reset token is required' })
                .min(1, { message: 'Reset token cannot be empty' }),
            password: z
                .string({ required_error: 'New password is required' })
                .min(6, { message: 'Password must be at least 6 characters long' })
                .max(100, { message: 'Password cannot exceed 100 characters' }),
        })
        .strict(),
};

// Schema for POST /update-class (request body)
const updateClassInUserSchema = {
    body: z
        .object({
            userName: z
                .string({ required_error: 'Username is required' })
                .min(1, { message: 'Username cannot be empty' }),
            _class: z
                .string({ required_error: 'Class ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Class ObjectId format',
                }),
        })
        .strict(),
};

// Schema for POST /update-password (request body)
const updatePasswordInUserSchema = {
    body: z
        .object({
            userName: z
                .string({ required_error: 'Username is required' })
                .min(1, { message: 'Username cannot be empty' }),
            prevPassword: z
                .string({ required_error: 'Previous password is required' })
                .min(1, { message: 'Previous password cannot be empty' }),
            newPassword: z
                .string({ required_error: 'New password is required' })
                .min(6, { message: 'New password must be at least 6 characters long' })
                .max(100, { message: 'New password cannot exceed 100 characters' }),
        })
        .strict(),
};

// Schema for POST /update-privilege (request body)
const updatePrivilegeSchema = {
    body: z
        .object({
            userName: z
                .string({ required_error: 'Username is required' })
                .min(1, { message: 'Username cannot be empty' }),
            privilege: z
                .string({ required_error: 'Privilege ID is required' })
                .refine((id) => mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Privilege ObjectId format',
                }),
        })
        .strict(),
};

// Schema for PATCH /:userName (consolidated update endpoint)
const updateUserSchema = {
    params: z
        .object({
            userName: z
                .string({ required_error: 'Username is required' })
                .min(1, { message: 'Username cannot be empty' })
                .max(50, { message: 'Username cannot exceed 50 characters' }),
        })
        .strict(),
    body: z
        .object({
            _class: z
                .string()
                .optional()
                .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Class ObjectId format',
                }),
            prevPassword: z.string().optional(),
            password: z
                .string()
                .optional()
                .refine((val) => !val || (val.length >= 6 && val.length <= 100), {
                    message: 'Password must be between 6 and 100 characters long',
                }),
            privilege: z
                .string()
                .optional()
                .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), {
                    message: 'Invalid Privilege ObjectId format',
                }),
        })
        .strict()
        .refine(
            (data) => {
                const hasClass = data._class !== undefined;
                const hasPassword = data.prevPassword !== undefined || data.password !== undefined;
                const hasPrivilege = data.privilege !== undefined;

                // Must have exactly one update type
                const updateCount = [hasClass, hasPassword, hasPrivilege].filter(Boolean).length;
                return updateCount === 1;
            },
            {
                message: 'Must provide exactly one of: _class, (prevPassword and password), or privilege',
            },
        )
        .refine(
            (data) => {
                // If updating password, both prevPassword and password must be provided
                if (data.prevPassword !== undefined || data.password !== undefined) {
                    return data.prevPassword !== undefined && data.password !== undefined;
                }
                return true;
            },
            {
                message: 'Both prevPassword and password are required when updating password',
            },
        ),
};

module.exports = {
    getUserSchema,
    getNotificationsSchema,
    removeNotificationSchema,
    addNewUserSchema,
    logInUserSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updateUserSchema,
    updateClassInUserSchema,
    updatePasswordInUserSchema,
    updatePrivilegeSchema,
};
