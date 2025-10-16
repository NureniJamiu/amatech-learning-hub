import { NextResponse } from 'next/server';
import { RateLimiter, RateLimitConfig, getRateLimitIdentifier } from '@/lib/rate-limiter';
import { IPBlocker } from '@/lib/ip-blocker';

export interface RateLimitMiddlewareOptions {
  config: RateLimitConfig;
  skipAuthenticated?: boolean; // Skip rate limiting for authenticated users
  getUserId?: (request: Request) => Promise<string | undefined>;
}

/**
 * Rate limit middleware factory
 * Creates a middleware function that enforces rate limits
 */
export function createRateLimitMiddleware(options: RateLimitMiddlewareOptions) {
  const limiter = new RateLimiter(options.config);

  return async (request: Request): Promise<NextResponse | null> => {
    try {
      // Check if IP is blocked first
      const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0].trim() 
        || request.headers.get('x-real-ip') 
        || 'unknown';

      const blockResult = await IPBlocker.isBlocked(clientIP);
      if (blockResult.isBlocked) {
        const retryAfter = blockResult.expiresAt 
          ? Math.ceil((blockResult.expiresAt.getTime() - Date.now()) / 1000)
          : 3600; // 1 hour default

        return NextResponse.json(
          {
            success: false,
            error: 'Access temporarily blocked',
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

      // Get user ID if available
      let userId: string | undefined;
      if (options.getUserId) {
        userId = await options.getUserId(request);
      }

      // Skip rate limiting for authenticated users if configured
      if (options.skipAuthenticated && userId) {
        return null; // Continue to next middleware
      }

      // Get identifier for rate limiting
      const identifier = getRateLimitIdentifier(request, userId);

      // Check rate limit
      const result = await limiter.checkLimit(identifier);

      // Add rate limit headers to response
      const headers = new Headers();
      headers.set('X-RateLimit-Limit', result.limit.toString());
      headers.set('X-RateLimit-Remaining', result.remaining.toString());
      headers.set('X-RateLimit-Reset', result.resetAt.toISOString());

      if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetAt.getTime() - Date.now()) / 1000);
        headers.set('Retry-After', retryAfter.toString());

        return NextResponse.json(
          {
            success: false,
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
            retryAfter,
          },
          {
            status: 429,
            headers,
          }
        );
      }

      // Rate limit passed, but we need to add headers to the response
      // Return null to continue, headers will be added by the wrapper
      return null;
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      // On error, allow the request (fail open)
      return null;
    }
  };
}

/**
 * Helper to apply rate limit middleware to API routes
 */
export async function applyRateLimit(
  request: Request,
  config: RateLimitConfig,
  userId?: string
): Promise<{ allowed: boolean; response?: NextResponse; headers: Headers }> {
  const limiter = new RateLimiter(config);
  const identifier = getRateLimitIdentifier(request, userId);

  try {
    const result = await limiter.checkLimit(identifier);

    const headers = new Headers();
    headers.set('X-RateLimit-Limit', result.limit.toString());
    headers.set('X-RateLimit-Remaining', result.remaining.toString());
    headers.set('X-RateLimit-Reset', result.resetAt.toISOString());

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetAt.getTime() - Date.now()) / 1000);
      headers.set('Retry-After', retryAfter.toString());

      const response = NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers,
        }
      );

      return { allowed: false, response, headers };
    }

    return { allowed: true, headers };
  } catch (error) {
    console.error('Rate limit error:', error);
    // On error, allow the request
    return { allowed: true, headers: new Headers() };
  }
}

/**
 * Helper to add rate limit headers to a response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  headers: Headers
): NextResponse {
  headers.forEach((value, key) => {
    response.headers.set(key, value);
  });
  return response;
}
