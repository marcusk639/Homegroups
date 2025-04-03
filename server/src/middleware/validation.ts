import {Request, Response, NextFunction} from 'express';
import {z, ZodError} from 'zod';
import {ApiError} from './error';
import {STATUS_CODES, ERROR_MESSAGES} from '../utils/constants';

/**
 * Middleware to validate request data against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param source - Source of data to validate (body, query, params)
 */
export const validate = (
  schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>,
  source: 'body' | 'query' | 'params' = 'body',
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];

      // Parse and validate the data
      schema.parse(data);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        // Send validation error response
        return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_INPUT,
          errors: formattedErrors,
        });
      }

      // If not a Zod error, pass to general error handler
      next(error);
    }
  };
};

// Common validation schemas

// Email validation
export const emailSchema = z
  .string()
  .email(ERROR_MESSAGES.INVALID_EMAIL_FORMAT);

// Password validation - at least 8 chars, at least 1 letter and 1 number
export const passwordSchema = z
  .string()
  .min(8, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
    'Password must include at least one letter and one number',
  );

// Date in YYYY-MM-DD format
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

// Time in HH:MM format (24h)
export const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format (24h)');

// User ID
export const userIdSchema = z.string().min(1, 'User ID is required');

// Group ID
export const groupIdSchema = z.string().min(1, 'Group ID is required');

// Pagination parameters
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val) : 10)),
});

// User registration schema
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().min(1, 'Display name is required'),
  recoveryDate: dateSchema.optional(),
});

// User login schema
export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Group creation schema
export const groupCreationSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string(),
  meetingDay: z.string().min(1, 'Meeting day is required'),
  meetingTime: timeSchema,
  location: z.string().min(1, 'Location is required'),
  address: z.string().optional(),
  format: z.string().min(1, 'Format is required'),
  isOnline: z.boolean(),
  onlineLink: z.string().url().optional(),
  foundedDate: dateSchema.optional(),
});

// Announcement creation schema
export const announcementCreationSchema = z.object({
  groupId: groupIdSchema,
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  isPinned: z.boolean().optional(),
  expiresAt: dateSchema.optional(),
});

// Event creation schema
export const eventCreationSchema = z.object({
  groupId: groupIdSchema,
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: dateSchema,
  time: timeSchema,
  duration: z.number().min(1, 'Duration is required'),
  location: z.string().min(1, 'Location is required'),
  address: z.string().optional(),
  isOnline: z.boolean(),
  onlineLink: z
    .string()
    .url()
    .optional()
    .refine(
      val => {
        // If isOnline is true, onlineLink must be provided
        return !val;
      },
      {
        message: 'Online link is required for online events',
        path: ['onlineLink'],
      },
    ),
});

// Transaction creation schema
export const transactionCreationSchema = z.object({
  groupId: groupIdSchema,
  type: z.enum(['income', 'expense'], {
    required_error: 'Transaction type is required',
  }),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  date: dateSchema,
  receipt: z.string().url().optional(),
});

import Joi from 'joi';

/**
 * Schema for creating a new announcement
 */
// export const announcementCreationSchema = Joi.object({
//   title: Joi.string().required().min(3).max(100).messages({
//     'string.empty': 'Title is required',
//     'string.min': 'Title must be at least 3 characters',
//     'string.max': 'Title cannot exceed 100 characters',
//     'any.required': 'Title is required',
//   }),

//   content: Joi.string().required().min(3).max(2000).messages({
//     'string.empty': 'Content is required',
//     'string.min': 'Content must be at least 3 characters',
//     'string.max': 'Content cannot exceed 2000 characters',
//     'any.required': 'Content is required',
//   }),

//   isPinned: Joi.boolean().default(false),

//   expiresAt: Joi.date().iso().min('now').allow(null).messages({
//     'date.format': 'Expiration date must be in ISO format (YYYY-MM-DD)',
//     'date.min': 'Expiration date must be in the future',
//   }),
// });

/**
 * Schema for updating an announcement
 */
export const announcementUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(100).messages({
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title cannot exceed 100 characters',
  }),

  content: Joi.string().min(3).max(2000).messages({
    'string.empty': 'Content cannot be empty',
    'string.min': 'Content must be at least 3 characters',
    'string.max': 'Content cannot exceed 2000 characters',
  }),

  isPinned: Joi.boolean(),

  expiresAt: Joi.date().iso().min('now').allow(null).messages({
    'date.format': 'Expiration date must be in ISO format (YYYY-MM-DD)',
    'date.min': 'Expiration date must be in the future',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });
