/**
 * Rate Limit Helpers
 * 
 * This file provides helper functions to easily apply rate limiting to API routes.
 * Import and use these functions at the beginning of your API route handlers.
 */

import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, addRateLimitHeaders } from '@/middleware/rate-limit.middleware';
import { RateLimitConfigs } from '@/lib/rate-limiter';
import { IPBlocker } from '@/lib/ip-blocker';
import { verifyAuthToken } from '@/utils/token';

/**
 * Apply rate limit for general API endpoints (100 requests per 15 minutes)
 */
export async function applyAPIRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const { allowed, response, headers } = await applyRateLimit(
    request,
    RateLimitConfigs.API
  );

  if (!allowed && response) {
    return response;
  }

  // Store headers to add to successful response later
  (request as any).rateLimitHeaders = headers;
  return null;
}

/**
 * Apply rate limit for auth endpoints (5 requests per 15 minutes)
 */
export async function applyAuthRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0].trim() 
    || request.headers.get('x-real-ip') 
    || 'unknown';

  // Check if IP is blocked
  const blockResult = await IPBlocker.isBlocked(clientIP);
  if (blockResult.isBlocked) {
    const retryAfter = blockResult.expiresAt 
      ? Math.ceil((blockResult.expiresAt.getTime() - Date.now()) / 1000)
      : 3600;

    return NextResponse.json(
      {
        success: false,
        error: 'Access blocked',
        message: `Your IP has been temporarily blocked due to: ${blockResult.reason}`,
        retryAfter,
      },
      {
        status: 403,
        headers: {
          'Retry-After': retryAfter.toString(),
        },
      }
    );
  }

  const { allowed, response, headers } = await applyRateLimit(
    request,
    RateLimitConfigs.AUTH
  );

  if (!allowed && response) {
    return response;
  }

  (request as any).rateLimitHeaders = headers;
  return null;
}

/**
 * Apply rate limit for file upload endpoints (10 uploads per hour)
 */
export async function applyFileUploadRateLimit(
  request: NextRequest,
  userId?: string
): Promise<NextResponse | null> {
  const { allowed, response, headers } = await applyRateLimit(
    request,
    RateLimitConfigs.FILE_UPLOAD,
    userId
  );

  if (!allowed && response) {
    return response;
  }

  (request as any).rateLimitHeaders = headers;
  return null;
}

/**
 * Apply rate limit for AI query endpoints (20 queries per hour)
 */
export async function applyAIQueryRateLimit(
  request: NextRequest,
  userId?: string
): Promise<NextResponse | null> {
  const { allowed, response, headers } = await applyRateLimit(
    request,
    RateLimitConfigs.AI_QUERY,
    userId
  );

  if (!allowed && response) {
    return response;
  }

  (request as any).rateLimitHeaders = headers;
  return null;
}

/**
 * Apply rate limit for admin endpoints (200 requests per 15 minutes)
 */
export async function applyAdminRateLimit(
  request: NextRequest,
  userId?: string
): Promise<NextResponse | null> {
  const { allowed, response, headers } = await applyRateLimit(
    request,
    RateLimitConfigs.ADMIN,
    userId
  );

  if (!allowed && response) {
    return response;
  }

  (request as any).rateLimitHeaders = headers;
  return null;
}

/**
 * Add rate limit headers to a successful response
 */
export function withRateLimitHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const headers = (request as any).rateLimitHeaders as Headers;
  if (headers) {
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }
  return response;
}

/**
 * Record a failed authentication attempt and potentially block the IP
 */
export async function recordFailedAuthAttempt(request: NextRequest): Promise<void> {
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0].trim() 
    || request.headers.get('x-real-ip') 
    || 'unknown';

  const wasBlocked = await IPBlocker.recordFailedAuth(
    clientIP,
    5, // Block after 5 failed attempts
    15 * 60 * 1000 // Block for 15 minutes
  );

  if (wasBlocked) {
    console.warn(`IP ${clientIP} has been blocked due to repeated failed authentication attempts`);
  }
}

/**
 * Reset failed authentication attempts on successful login
 */
export async function resetFailedAuthAttempts(request: NextRequest): Promise<void> {
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0].trim() 
    || request.headers.get('x-real-ip') 
    || 'unknown';

  await IPBlocker.resetFailedAuth(clientIP);
}

/**
 * Get user ID from request token (for authenticated rate limiting)
 */
export async function getUserIdFromRequest(request: NextRequest): Promise<string | undefined> {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return undefined;

    const payload = await verifyAuthToken(token);
    return payload?.userId;
  } catch {
    return undefined;
  }
}
