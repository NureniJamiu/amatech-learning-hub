import prisma from '@/lib/prisma';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the window
  keyPrefix?: string; // Optional prefix for the key
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  limit: number;
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if a request is allowed based on rate limits
   */
  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const key = this.config.keyPrefix 
      ? `${this.config.keyPrefix}:${identifier}` 
      : identifier;

    const now = new Date();
    const resetAt = new Date(now.getTime() + this.config.windowMs);

    try {
      // Find or create rate limit record
      let rateLimit = await prisma.rateLimit.findUnique({
        where: { key },
      });

      // If no record exists or reset time has passed, create/reset
      if (!rateLimit || rateLimit.resetAt <= now) {
        rateLimit = await prisma.rateLimit.upsert({
          where: { key },
          create: {
            key,
            count: 1,
            resetAt,
          },
          update: {
            count: 1,
            resetAt,
          },
        });

        return {
          allowed: true,
          remaining: this.config.maxRequests - 1,
          resetAt,
          limit: this.config.maxRequests,
        };
      }

      // Check if limit exceeded
      if (rateLimit.count >= this.config.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: rateLimit.resetAt,
          limit: this.config.maxRequests,
        };
      }

      // Increment count
      rateLimit = await prisma.rateLimit.update({
        where: { key },
        data: {
          count: {
            increment: 1,
          },
        },
      });

      return {
        allowed: true,
        remaining: this.config.maxRequests - rateLimit.count,
        resetAt: rateLimit.resetAt,
        limit: this.config.maxRequests,
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      // On error, allow the request (fail open)
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetAt,
        limit: this.config.maxRequests,
      };
    }
  }

  /**
   * Reset rate limit for a specific key
   */
  async resetLimit(identifier: string): Promise<void> {
    const key = this.config.keyPrefix 
      ? `${this.config.keyPrefix}:${identifier}` 
      : identifier;

    try {
      await prisma.rateLimit.delete({
        where: { key },
      });
    } catch (error) {
      // Ignore if record doesn't exist
      if ((error as any).code !== 'P2025') {
        console.error('Error resetting rate limit:', error);
      }
    }
  }

  /**
   * Clean up expired rate limit records
   */
  static async cleanupExpired(): Promise<number> {
    try {
      const result = await prisma.rateLimit.deleteMany({
        where: {
          resetAt: {
            lte: new Date(),
          },
        },
      });
      return result.count;
    } catch (error) {
      console.error('Error cleaning up expired rate limits:', error);
      return 0;
    }
  }
}

// Predefined rate limit configurations
export const RateLimitConfigs = {
  // General API endpoints: 100 requests per 15 minutes
  API: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
    keyPrefix: 'api',
  },
  // Auth endpoints: 5 requests per 15 minutes
  AUTH: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    keyPrefix: 'auth',
  },
  // File uploads: 10 uploads per hour
  FILE_UPLOAD: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 10,
    keyPrefix: 'upload',
  },
  // AI queries: 20 queries per hour
  AI_QUERY: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 20,
    keyPrefix: 'ai',
  },
  // Admin endpoints: 200 requests per 15 minutes
  ADMIN: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 200,
    keyPrefix: 'admin',
  },
} as const;

/**
 * Helper function to get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to a default (should not happen in production)
  return 'unknown';
}

/**
 * Helper function to get user identifier (IP or user ID)
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  // Use user ID if authenticated, otherwise use IP
  return userId || getClientIP(request);
}
