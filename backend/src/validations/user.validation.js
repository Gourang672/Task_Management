import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
  body: z.object({
    firstName: z.string()
      .min(1, 'First name is required')
      .max(50, 'First name cannot exceed 50 characters')
      .trim(),

    lastName: z.string()
      .min(1, 'Last name is required')
      .max(50, 'Last name cannot exceed 50 characters')
      .trim(),

    email: z.string()
      .transform(val => val.toLowerCase().trim())
      .pipe(z.email('Please provide a valid email address')),

    password: z.string()
      .min(6, 'Password must be at least 6 characters long')
      .max(100, 'Password cannot exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
  })
});

// User login schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string()
      .transform(val => val.toLowerCase().trim())
      .pipe(z.email('Please provide a valid email address')),

    password: z.string()
      .min(1, 'Password is required')
      .max(100, 'Password cannot exceed 100 characters')
  })
});

// User update schema (for future use)
export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string()
      .min(1, 'First name is required')
      .max(50, 'First name cannot exceed 50 characters')
      .trim()
      .optional(),

    lastName: z.string()
      .min(1, 'Last name is required')
      .max(50, 'Last name cannot exceed 50 characters')
      .trim()
      .optional(),

    email: z.string()
      .transform(val => val.toLowerCase().trim())
      .pipe(z.email('Please provide a valid email address'))
      .optional(),

    currentPassword: z.string()
      .min(1, 'Current password is required to update profile')
      .optional(),

    newPassword: z.string()
      .min(6, 'New password must be at least 6 characters long')
      .max(100, 'New password cannot exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'New password must contain at least one lowercase letter, one uppercase letter, and one number'
      )
      .optional()
  })
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string()
      .transform(val => val.toLowerCase().trim())
      .pipe(z.email('Please provide a valid email address'))
  })
});

// Reset password schema
export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string()
      .transform(val => val.toLowerCase().trim())
      .pipe(z.email('Please provide a valid email address')),

    newPassword: z.string()
      .min(6, 'New password must be at least 6 characters long')
      .max(100, 'New password cannot exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'New password must contain at least one lowercase letter, one uppercase letter, and one number'
      )
  })
});

// Task validation schemas
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string()
      .min(1, 'Title is required')
      .max(100, 'Title cannot exceed 100 characters')
      .trim(),

    description: z.string()
      .min(1, 'Description is required')
      .max(500, 'Description cannot exceed 500 characters')
      .trim(),

    status: z.enum(['pending', 'completed'])
      .optional()
      .default('pending')
  })
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string()
      .min(1, 'Title is required')
      .max(100, 'Title cannot exceed 100 characters')
      .trim()
      .optional(),

    description: z.string()
      .min(1, 'Description is required')
      .max(500, 'Description cannot exceed 500 characters')
      .trim()
      .optional(),

    status: z.enum(['pending', 'completed'])
      .optional()
  })
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format')
  })
});

export const getTasksSchema = z.object({
  query: z.object({
    page: z.string()
      .optional()
      .transform(val => val ? parseInt(val) : 1)
      .refine(val => val > 0, 'Page must be greater than 0'),

    limit: z.string()
      .optional()
      .transform(val => val ? parseInt(val) : 10)
      .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100'),

    status: z.enum(['pending', 'completed'])
      .optional(),

    sortBy: z.enum(['createdAt', 'updatedAt', 'title'])
      .optional()
      .default('createdAt'),

    sortOrder: z.enum(['asc', 'desc'])
      .optional()
      .default('desc')
  })
});