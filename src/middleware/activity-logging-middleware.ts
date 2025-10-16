/**
 * Activity Logging Middleware
 * 
 * Middleware to automatically log all API requests with duration and context
 */

import { NextRequest, NextResponse } from 'next/server';
import { ActivityLogger } from '@/lib/activity-logger';

/**
 * Extract IP address from request
 */
function getIpAddress(request: NextRequest): string | undefined {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    undefined
  );
}

/**
 * Extract user agent from request
 */
function getUserAgent(request: NextRequest): string | undefined {
  return request.headers.get('user-agent') || undefined;
}

/**
 * Extract user ID from request (if authenticated)
 * This assumes the token is stored in cookies and decoded
 */
function getUserId(request: NextRequest): string | undefined {
  // This would need to be implemented based on your auth system
  // For now, return undefined
  return undefined;
}

/**
 * Wrap an API route handler with activity logging
 */
export function withActivityLogging(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const startTime = Date.now();
    const endpoint = request.nextUrl.pathname;
    const method = request.method;
    const ipAddress = getIpAddress(request);
    const userAgent = getUserAgent(request);
    const userId = getUserId(request);

    let response: NextResponse | undefined;
    let error: string | undefined;

    try {
      // Call the actual handler
      response = await handler(request, context);
      
      const duration = Date.now() - startTime;
      const statusCode = response.status;

      // Log the request asynchronously (don't await to avoid blocking)
      ActivityLogger.logRequest({
        userId,
        endpoint,
        method,
        statusCode,
        duration,
        ipAddress,
        userAgent,
        error,
      }).catch(err => {
        console.error('Failed to log activity:', err);
      });

      return response;
    } catch (err: any) {
      // Log the error
      error = err.message || 'Unknown error';
      const duration = Date.now() - startTime;
      
      ActivityLogger.logRequest({
        userId,
        endpoint,
        method,
        statusCode: 500,
        duration,
        ipAddress,
        userAgent,
        error,
      }).catch(logErr => {
        console.error('Failed to log activity:', logErr);
      });
      
      // Re-throw to let error handling middleware deal with it
      throw err;
    }
  };
}

/**
 * Create a logging wrapper for route handlers
 * Usage: export const GET = withLogging(async (request) => { ... });
 */
export function withLogging(
  handler: (request: NextRequest, context?: any) => Promise<Response>
) {
  return async (request: NextRequest, context?: any): Promise<Response> => {
    const startTime = Date.now();
    const endpoint = request.nextUrl.pathname;
    const method = request.method;
    const ipAddress = getIpAddress(request);
    const userAgent = getUserAgent(request);

    let statusCode = 500;
    let error: string | undefined;

    try {
      const response = await handler(request, context);
      statusCode = response.status;
      
      // Log after response is ready
      const duration = Date.now() - startTime;
      
      ActivityLogger.logRequest({
        endpoint,
        method,
        statusCode,
        duration,
        ipAddress,
        userAgent,
      }).catch(err => {
        console.error('Failed to log activity:', err);
      });

      return response;
    } catch (err: any) {
      error = err.message || 'Unknown error';
      const duration = Date.now() - startTime;
      
      // Log the error
      ActivityLogger.logRequest({
        endpoint,
        method,
        statusCode,
        duration,
        ipAddress,
        userAgent,
        error,
      }).catch(logErr => {
        console.error('Failed to log activity:', logErr);
      });

      throw err;
    }
  };
}
