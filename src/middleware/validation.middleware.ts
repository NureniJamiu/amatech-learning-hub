/**
 * Validation Middleware
 * 
 * Reusable middleware for validating request bodies, query parameters,
 * and route parameters using Zod schemas.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';
import { createError, ErrorCode } from '@/lib/error-handler';

/**
 * Validation result type
 */
export type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: NextResponse;
};

/**
 * Format Zod validation errors into a user-friendly structure
 */
export function formatZodErrors(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  error.issues.forEach((err: any) => {
    const path = err.path.join('.');
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });

  return formatted;
}

/**
 * Validate request body against a Zod schema
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    const validated = schema.parse(body);

    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatZodErrors(error);

      return {
        success: false,
        error: NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            code: ErrorCode.VAL_INVALID_FORMAT,
            details: errors,
          },
          { status: 400 }
        ),
      };
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: NextResponse.json(
          {
            success: false,
            error: 'Invalid JSON in request body',
            code: ErrorCode.VAL_INVALID_FORMAT,
          },
          { status: 400 }
        ),
      };
    }

    // Unexpected error
    return {
      success: false,
      error: NextResponse.json(
        {
          success: false,
          error: 'Request validation failed',
          code: ErrorCode.VAL_INVALID_FORMAT,
        },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): ValidationResult<T> {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, any> = {};

    // Convert URLSearchParams to plain object
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const validated = schema.parse(params);

    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatZodErrors(error);

      return {
        success: false,
        error: NextResponse.json(
          {
            success: false,
            error: 'Invalid query parameters',
            code: ErrorCode.VAL_INVALID_FORMAT,
            details: errors,
          },
          { status: 400 }
        ),
      };
    }

    return {
      success: false,
      error: NextResponse.json(
        {
          success: false,
          error: 'Query parameter validation failed',
          code: ErrorCode.VAL_INVALID_FORMAT,
        },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate route parameters against a Zod schema
 */
export function validateParams<T>(
  params: Record<string, string | string[]>,
  schema: ZodSchema<T>
): ValidationResult<T> {
  try {
    const validated = schema.parse(params);

    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatZodErrors(error);

      return {
        success: false,
        error: NextResponse.json(
          {
            success: false,
            error: 'Invalid route parameters',
            code: ErrorCode.VAL_INVALID_FORMAT,
            details: errors,
          },
          { status: 400 }
        ),
      };
    }

    return {
      success: false,
      error: NextResponse.json(
        {
          success: false,
          error: 'Route parameter validation failed',
          code: ErrorCode.VAL_INVALID_FORMAT,
        },
        { status: 400 }
      ),
    };
  }
}

/**
 * Higher-order function to wrap API route handlers with validation
 */
export function withValidation<TBody = any, TQuery = any>(
  handler: (
    request: NextRequest,
    context: { params?: any; body?: TBody; query?: TQuery }
  ) => Promise<NextResponse>,
  options: {
    bodySchema?: ZodSchema<TBody>;
    querySchema?: ZodSchema<TQuery>;
    paramsSchema?: ZodSchema<any>;
  } = {}
) {
  return async (
    request: NextRequest,
    context?: { params?: any }
  ): Promise<NextResponse> => {
    try {
      let body: TBody | undefined;
      let query: TQuery | undefined;
      let params: any = context?.params;

      // Validate body if schema provided
      if (options.bodySchema && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const bodyResult = await validateBody(request, options.bodySchema);
        if (!bodyResult.success) {
          return bodyResult.error;
        }
        body = bodyResult.data;
      }

      // Validate query if schema provided
      if (options.querySchema) {
        const queryResult = validateQuery(request, options.querySchema);
        if (!queryResult.success) {
          return queryResult.error;
        }
        query = queryResult.data;
      }

      // Validate params if schema provided
      if (options.paramsSchema && params) {
        const paramsResult = validateParams(params, options.paramsSchema);
        if (!paramsResult.success) {
          return paramsResult.error;
        }
        params = paramsResult.data;
      }

      // Call the handler with validated data
      return await handler(request, { params, body, query });
    } catch (error) {
      console.error('[Validation Middleware] Unexpected error:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error',
          code: ErrorCode.INTERNAL_ERROR,
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Validate a single field value
 */
export function validateField<T>(
  value: any,
  schema: ZodSchema<T>
): { valid: boolean; data?: T; error?: string } {
  try {
    const validated = schema.parse(value);
    return { valid: true, data: validated };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return {
        valid: false,
        error: error.issues[0]?.message || 'Validation failed',
      };
    }
    return { valid: false, error: 'Validation failed' };
  }
}

/**
 * Safe parse that returns a result object instead of throwing
 */
export function safeParse<T>(
  data: unknown,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: formatZodErrors(error),
      };
    }
    return {
      success: false,
      errors: { _general: ['Validation failed'] },
    };
  }
}
