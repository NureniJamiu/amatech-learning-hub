/**
 * Comprehensive Zod Validation Schemas
 * 
 * Centralized validation schemas for all API endpoints using Zod.
 * Provides type-safe validation with detailed error messages.
 */

import { z } from 'zod';

/**
 * Common field validators
 */
export const commonValidators = {
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password is too long'),
  cuid: z.string().cuid('Invalid ID format'),
  url: z.string().url('Invalid URL format'),
  positiveInt: z.number().int().positive('Must be a positive integer'),
  nonEmptyString: z.string().min(1, 'This field is required').trim(),
};

/**
 * Authentication Schemas
 */
export const authSchemas = {
  login: z.object({
    email: commonValidators.email,
    password: commonValidators.password,
  }),

  signup: z.object({
    firstname: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name is too long').trim(),
    lastname: z.string().max(50, 'Last name is too long').trim().optional(),
    email: commonValidators.email,
    password: commonValidators.password,
    passwordConfirmation: z.string(),
    matricNumber: z.string().regex(/^[A-Z0-9\/]+$/i, 'Invalid matric number format').trim(),
    level: z.number().int().refine(val => [100, 200, 300, 400, 500].includes(val), {
      message: 'Level must be 100, 200, 300, 400, or 500',
    }),
    department: z.string().min(2, 'Department must be at least 2 characters').trim(),
    faculty: z.string().min(2, 'Faculty must be at least 2 characters').trim(),
  }).refine(data => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),

  changePassword: z.object({
    currentPassword: commonValidators.password,
    newPassword: commonValidators.password,
    confirmPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
};

/**
 * Course Schemas
 */
export const courseSchemas = {
  create: z.object({
    code: z.string()
      .min(3, 'Course code must be at least 3 characters')
      .max(10, 'Course code is too long')
      .regex(/^[A-Z]{2,4}\s?\d{3}$/i, 'Invalid course code format (e.g., CSC101)')
      .trim()
      .toUpperCase(),
    title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long').trim(),
    units: z.number().int().min(1, 'Units must be at least 1').max(6, 'Units cannot exceed 6'),
    level: z.number().int().refine(val => [100, 200, 300, 400, 500].includes(val), {
      message: 'Level must be 100, 200, 300, 400, or 500',
    }),
    semester: z.number().int().refine(val => [1, 2].includes(val), {
      message: 'Semester must be 1 or 2',
    }),
    description: z.string().max(1000, 'Description is too long').trim().optional(),
    tutorIds: z.array(commonValidators.cuid).optional(),
  }),

  update: z.object({
    code: z.string()
      .min(3, 'Course code must be at least 3 characters')
      .max(10, 'Course code is too long')
      .regex(/^[A-Z]{2,4}\s?\d{3}$/i, 'Invalid course code format')
      .trim()
      .toUpperCase()
      .optional(),
    title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long').trim().optional(),
    units: z.number().int().min(1).max(6).optional(),
    level: z.number().int().refine(val => [100, 200, 300, 400, 500].includes(val)).optional(),
    semester: z.number().int().refine(val => [1, 2].includes(val)).optional(),
    description: z.string().max(1000).trim().optional(),
    tutorIds: z.array(commonValidators.cuid).optional(),
  }),

  query: z.object({
    level: z.coerce.number().int().refine(val => [100, 200, 300, 400, 500].includes(val)).optional(),
    semester: z.coerce.number().int().refine(val => [1, 2].includes(val)).optional(),
    search: z.string().max(100).trim().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
};

/**
 * Material Schemas
 */
export const materialSchemas = {
  create: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long').trim(),
    courseId: commonValidators.cuid,
    fileUrl: commonValidators.url,
    fileType: z.string().default('application/pdf'),
  }),

  update: z.object({
    title: z.string().min(3).max(200).trim().optional(),
    courseId: commonValidators.cuid.optional(),
  }),

  query: z.object({
    courseId: commonValidators.cuid.optional(),
    search: z.string().max(100).trim().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
};

/**
 * Past Question Schemas
 */
export const pastQuestionSchemas = {
  create: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long').trim(),
    year: z.number().int().min(2000, 'Year must be 2000 or later').max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
    courseId: commonValidators.cuid,
    fileUrl: commonValidators.url,
    fileType: z.string().default('application/pdf'),
  }),

  update: z.object({
    title: z.string().min(3).max(200).trim().optional(),
    year: z.number().int().min(2000).max(new Date().getFullYear() + 1).optional(),
    courseId: commonValidators.cuid.optional(),
  }),

  query: z.object({
    courseId: commonValidators.cuid.optional(),
    year: z.coerce.number().int().optional(),
    search: z.string().max(100).trim().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
};

/**
 * Tutor Schemas
 */
export const tutorSchemas = {
  create: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').trim(),
    email: commonValidators.email,
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number').optional(),
    specialization: z.string().max(200).trim().optional(),
    bio: z.string().max(1000).trim().optional(),
    avatar: commonValidators.url.optional(),
  }),

  update: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    email: commonValidators.email.optional(),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/).optional(),
    specialization: z.string().max(200).trim().optional(),
    bio: z.string().max(1000).trim().optional(),
    avatar: commonValidators.url.optional(),
  }),
};

/**
 * Timetable Schemas
 */
export const timetableSchemas = {
  create: z.object({
    courseId: commonValidators.cuid,
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)'),
    location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location is too long').trim(),
    semester: z.number().int().refine(val => [1, 2].includes(val), {
      message: 'Semester must be 1 or 2',
    }),
  }),

  update: z.object({
    courseId: commonValidators.cuid.optional(),
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).optional(),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    location: z.string().min(2).max(100).trim().optional(),
    semester: z.number().int().refine(val => [1, 2].includes(val)).optional(),
  }),

  query: z.object({
    userId: commonValidators.cuid.optional(),
    semester: z.coerce.number().int().refine(val => [1, 2].includes(val)).optional(),
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).optional(),
  }),
};

/**
 * AI Chat Schemas
 */
export const aiChatSchemas = {
  query: z.object({
    message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message is too long').trim(),
    courseId: commonValidators.cuid.optional(),
    sessionId: commonValidators.cuid.optional(),
    userId: commonValidators.cuid,
  }),

  sessionQuery: z.object({
    sessionId: commonValidators.cuid.optional(),
    userId: commonValidators.cuid.optional(),
  }).refine(data => data.sessionId || data.userId, {
    message: 'Either sessionId or userId must be provided',
  }),
};

/**
 * User Profile Schemas
 */
export const userSchemas = {
  updateProfile: z.object({
    firstname: z.string().min(2).max(50).trim().optional(),
    lastname: z.string().max(50).trim().optional(),
    department: z.string().min(2).trim().optional(),
    faculty: z.string().min(2).trim().optional(),
    level: z.number().int().refine(val => [100, 200, 300, 400, 500].includes(val)).optional(),
    currentSemester: z.number().int().refine(val => [1, 2].includes(val)).optional(),
    avatar: commonValidators.url.optional(),
  }),

  updateAvatar: z.object({
    avatar: commonValidators.url,
  }),
};

/**
 * Admin Schemas
 */
export const adminSchemas = {
  updateUserRole: z.object({
    userId: commonValidators.cuid,
    isAdmin: z.boolean(),
  }),

  systemSettings: z.object({
    maintenanceMode: z.boolean().optional(),
    allowSignups: z.boolean().optional(),
    maxFileSize: z.number().int().positive().optional(),
    announcementMessage: z.string().max(500).optional(),
  }),
};

/**
 * Bookmark Schemas
 */
export const bookmarkSchemas = {
  create: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long').trim(),
    url: commonValidators.url,
    icon: z.string().max(50).optional(),
  }),

  update: z.object({
    title: z.string().min(1).max(100).trim().optional(),
    url: commonValidators.url.optional(),
    icon: z.string().max(50).optional(),
  }),
};

/**
 * File Upload Schemas
 */
export const fileUploadSchemas = {
  pdf: z.object({
    file: z.instanceof(File).refine(
      file => file.type === 'application/pdf',
      'File must be a PDF'
    ).refine(
      file => file.size <= 10 * 1024 * 1024,
      'File size must be less than 10MB'
    ),
  }),

  image: z.object({
    file: z.instanceof(File).refine(
      file => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
      'File must be an image (JPEG, PNG, GIF, or WebP)'
    ).refine(
      file => file.size <= 5 * 1024 * 1024,
      'File size must be less than 5MB'
    ),
  }),
};

/**
 * Export all schemas
 */
export const validationSchemas = {
  auth: authSchemas,
  course: courseSchemas,
  material: materialSchemas,
  pastQuestion: pastQuestionSchemas,
  tutor: tutorSchemas,
  timetable: timetableSchemas,
  aiChat: aiChatSchemas,
  user: userSchemas,
  admin: adminSchemas,
  bookmark: bookmarkSchemas,
  fileUpload: fileUploadSchemas,
};
