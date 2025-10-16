/**
 * Request Logger Utility
 * 
 * Simple utility to log API requests with timing information
 */

import { ActivityLogger } from '@/lib/activity-logger';
import { NextRequest } from 'next/server';

export interface RequestContext {
  userId?: string;
  endpoint: string;
  method: string;
  ipAddress?: string;
  userAgent?: string;
  startTime: number;
}

/**
 * Extract request context
 */
export function getRequestContext(request: NextRequest): Omit<RequestContext, 'startTime'> {
  const endpoint = request.nextUrl.pathname;
  const method = request.method;
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    undefined;
  const userAgent = request.headers.get('user-agent') || undefined;

  return {
    endpoint,
    method,
    ipAddress,
    userAgent,
  };
}

/**
 * Start request timing
 */
export function startRequestTimer(request: NextRequest): RequestContext {
  return {
    ...getRequestContext(request),
    startTime: Date.now(),
  };
}

/**
 * Log request completion
 */
export async function logRequestCompletion(
  context: RequestContext,
  statusCode: number,
  error?: string
): Promise<void> {
  const duration = Date.now() - context.startTime;

  await ActivityLogger.logRequest({
    userId: context.userId,
    endpoint: context.endpoint,
    method: context.method,
    statusCode,
    duration,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    error,
  });
}

/**
 * Simple wrapper for logging requests
 * Usage in route handlers:
 * 
 * export async function GET(request: NextRequest) {
 *   const timer = startRequestTimer(request);
 *   try {
 *     // ... your code
 *     await logRequestCompletion(timer, 200);
 *     return NextResponse.json({ ... });
 *   } catch (error) {
 *     await logRequestCompletion(timer, 500, error.message);
 *     throw error;
 *   }
 * }
 */
