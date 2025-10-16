/**
 * Validation Usage Examples
 * 
 * This file demonstrates how to use the validation middleware and schemas
 * in API routes. These are reference examples for implementing validation
 * across the application.
 */

import { NextRequest, NextResponse } from 'next/server';
import { withValidation, validateBody, validateQuery } from '@/middleware/validation.middleware';
import { validationSchemas } from './validation-schemas';
import { sanitizeHtml, sanitizeInput, sanitizeEmail, validateSafety } from './sanitization';
import { validateFile } from './file-validation';
import { z } from 'zod';

/**
 * Example 1: Using withValidation wrapper for automatic validation
 */
export const exampleWithValidationWrapper = withValidation(
    async (request, { body, query }) => {
        // body and query are already validated and typed
        // No need for manual validation here

        return NextResponse.json({
            success: true,
            data: body,
        });
    },
    {
        bodySchema: validationSchemas.course.create,
        querySchema: validationSchemas.course.query,
    }
);

/**
 * Example 2: Manual validation in route handler
 */
export async function exampleManualValidation(request: NextRequest) {
    // Validate request body
    const bodyResult = await validateBody(request, validationSchemas.auth.login);

    if (!bodyResult.success) {
        return bodyResult.error;
    }

    const { email, password } = bodyResult.data;

    // Process validated data
    // ...

    return NextResponse.json({ success: true });
}

/**
 * Example 3: Validating query parameters
 */
export async function exampleQueryValidation(request: NextRequest) {
    const queryResult = validateQuery(request, validationSchemas.course.query);

    if (!queryResult.success) {
        return queryResult.error;
    }

    const { level, semester, search, page, limit } = queryResult.data;

    // Use validated query parameters
    // ...

    return NextResponse.json({ success: true });
}

/**
 * Example 4: Sanitizing user input before storage
 */
export async function exampleSanitization(request: NextRequest) {
    const body = await request.json();

    // Sanitize HTML content
    const sanitizedDescription = sanitizeHtml(body.description);

    // Sanitize general text input
    const sanitizedTitle = sanitizeInput(body.title, 200);

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(body.email);

    // Validate safety (check for XSS and path traversal)
    validateSafety(body.userInput, 'User input');

    // Store sanitized data
    // ...

    return NextResponse.json({ success: true });
}

/**
 * Example 5: File upload with validation
 */
export async function exampleFileUpload(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json(
            { success: false, error: 'No file provided' },
            { status: 400 }
        );
    }

    // Validate file
    const validationResult = validateFile(file, ['pdf']);

    if (!validationResult.valid) {
        return NextResponse.json(
            { success: false, error: validationResult.error },
            { status: 400 }
        );
    }

    // Process validated file
    // ...

    return NextResponse.json({ success: true });
}

/**
 * Example 6: Combining multiple validations
 */
export const exampleCombinedValidation = withValidation(
    async (request, { body, query }) => {
        // Body and query are already validated by middleware
        if (!body) {
            return NextResponse.json(
                { success: false, error: 'Request body is required' },
                { status: 400 }
            );
        }

        // Additional custom validation
        if (body.title) {
            validateSafety(body.title, 'Title');
        }

        // Sanitize before storage
        const sanitizedData = {
            title: sanitizeInput(body.title, 200),
            courseId: body.courseId,
            fileUrl: body.fileUrl,
            fileType: body.fileType,
        };

        // Process sanitized data
        // ...

        return NextResponse.json({
            success: true,
            data: sanitizedData,
        });
    },
    {
        bodySchema: validationSchemas.material.create,
        querySchema: z.object({
            userId: z.string().cuid(),
        }),
    }
);

/**
 * Example 7: Custom validation schema for specific endpoint
 */
const customSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
    age: z.number().int().min(18).max(120),
    tags: z.array(z.string().max(50)).max(10),
});

export const exampleCustomSchema = withValidation(
    async (request, { body }) => {
        return NextResponse.json({
            success: true,
            data: body,
        });
    },
    {
        bodySchema: customSchema,
    }
);

/**
 * Example 8: Validation with error handling
 */
export async function exampleWithErrorHandling(request: NextRequest) {
    try {
        const bodyResult = await validateBody(request, validationSchemas.auth.signup);

        if (!bodyResult.success) {
            return bodyResult.error;
        }

        const userData = bodyResult.data;

        // Additional business logic validation
        if (userData.level < 100) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid level',
                    details: { level: ['Level must be at least 100'] },
                },
                { status: 400 }
            );
        }

        // Process validated data
        // ...

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Validation error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Example 9: Partial validation (for PATCH/UPDATE endpoints)
 */
export const examplePartialValidation = withValidation(
    async (request, { body, params }) => {
        // Only provided fields are validated
        // All fields are optional in the update schema

        return NextResponse.json({
            success: true,
            data: body,
        });
    },
    {
        bodySchema: validationSchemas.course.update,
        paramsSchema: z.object({
            courseId: z.string().cuid(),
        }),
    }
);

/**
 * Example 10: Array validation
 */
const bulkCreateSchema = z.object({
    courses: z.array(validationSchemas.course.create).min(1).max(50),
});

export const exampleArrayValidation = withValidation(
    async (request, { body }) => {
        // body.courses is an array of validated course objects
        if (!body) {
            return NextResponse.json(
                { success: false, error: 'Request body is required' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            count: body.courses.length,
        });
    },
    {
        bodySchema: bulkCreateSchema,
    }
);

/**
 * Example 11: Conditional validation
 */
const conditionalSchema = z.object({
    type: z.enum(['student', 'admin']),
    matricNumber: z.string().optional(),
    adminCode: z.string().optional(),
}).refine(
    (data) => {
        if (data.type === 'student') {
            return !!data.matricNumber;
        }
        if (data.type === 'admin') {
            return !!data.adminCode;
        }
        return true;
    },
    {
        message: 'Student must provide matricNumber, admin must provide adminCode',
    }
);

export const exampleConditionalValidation = withValidation(
    async (request, { body }) => {
        return NextResponse.json({
            success: true,
            data: body,
        });
    },
    {
        bodySchema: conditionalSchema,
    }
);

/**
 * Example 12: Nested object validation
 */
const nestedSchema = z.object({
    user: z.object({
        name: z.string().min(2),
        email: z.string().email(),
    }),
    course: z.object({
        code: z.string().regex(/^[A-Z]{2,4}\d{3}$/),
        title: z.string().min(3),
    }),
    metadata: z.record(z.string(), z.any()).optional(),
});

export const exampleNestedValidation = withValidation(
    async (request, { body }) => {
        return NextResponse.json({
            success: true,
            data: body,
        });
    },
    {
        bodySchema: nestedSchema,
    }
);
