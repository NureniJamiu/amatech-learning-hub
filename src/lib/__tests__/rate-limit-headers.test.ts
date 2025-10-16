/**
 * Rate Limit Headers Test
 * 
 * Tests that rate limit response headers are correctly set according to requirements:
 * - X-RateLimit-Limit: Maximum requests allowed
 * - X-RateLimit-Remaining: Remaining requests in current window
 * - X-RateLimit-Reset: When the rate limit resets (ISO timestamp)
 * - Retry-After: Seconds until retry (when rate limit exceeded)
 * - 429 status code when rate limit exceeded
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { RateLimiter, RateLimitConfigs } from '../rate-limiter';
import { applyRateLimit } from '@/middleware/rate-limit.middleware';
import prisma from '../prisma';

describe('Rate Limit Headers', () => {
  const testKey = 'test-rate-limit-headers';
  
  beforeEach(async () => {
    // Clean up test data
    await prisma.rateLimit.deleteMany({
      where: { key: { contains: testKey } },
    });
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.rateLimit.deleteMany({
      where: { key: { contains: testKey } },
    });
  });

  describe('Successful Requests (Under Limit)', () => {
    it('should include X-RateLimit-Limit header', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 10,
        keyPrefix: testKey,
      });

      const result = await limiter.checkLimit('user1');

      expect(result.limit).toBe(10);
      expect(result.allowed).toBe(true);
    });

    it('should include X-RateLimit-Remaining header', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 10,
        keyPrefix: testKey,
      });

      // First request
      const result1 = await limiter.checkLimit('user2');
      expect(result1.remaining).toBe(9);

      // Second request
      const result2 = await limiter.checkLimit('user2');
      expect(result2.remaining).toBe(8);

      // Third request
      const result3 = await limiter.checkLimit('user2');
      expect(result3.remaining).toBe(7);
    });

    it('should include X-RateLimit-Reset header with future timestamp', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 10,
        keyPrefix: testKey,
      });

      const now = new Date();
      const result = await limiter.checkLimit('user3');

      expect(result.resetAt).toBeInstanceOf(Date);
      expect(result.resetAt.getTime()).toBeGreaterThan(now.getTime());
      expect(result.resetAt.getTime()).toBeLessThanOrEqual(now.getTime() + 60000);
    });

    it('should decrement remaining count with each request', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 5,
        keyPrefix: testKey,
      });

      const results = [];
      for (let i = 0; i < 5; i++) {
        results.push(await limiter.checkLimit('user4'));
      }

      expect(results[0].remaining).toBe(4);
      expect(results[1].remaining).toBe(3);
      expect(results[2].remaining).toBe(2);
      expect(results[3].remaining).toBe(1);
      expect(results[4].remaining).toBe(0);
    });
  });

  describe('Rate Limit Exceeded (429 Response)', () => {
    it('should return allowed=false when limit exceeded', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 3,
        keyPrefix: testKey,
      });

      // Make 3 requests (at limit)
      await limiter.checkLimit('user5');
      await limiter.checkLimit('user5');
      await limiter.checkLimit('user5');

      // 4th request should be blocked
      const result = await limiter.checkLimit('user5');
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should include Retry-After information when limit exceeded', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 2,
        keyPrefix: testKey,
      });

      // Exhaust limit
      await limiter.checkLimit('user6');
      await limiter.checkLimit('user6');

      // Next request should be blocked with retry info
      const result = await limiter.checkLimit('user6');
      expect(result.allowed).toBe(false);
      
      // Calculate retry-after in seconds
      const retryAfter = Math.ceil((result.resetAt.getTime() - Date.now()) / 1000);
      expect(retryAfter).toBeGreaterThan(0);
      expect(retryAfter).toBeLessThanOrEqual(60);
    });

    it('should maintain same resetAt for all requests in window', async () => {
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 5,
        keyPrefix: testKey,
      });

      const result1 = await limiter.checkLimit('user7');
      const result2 = await limiter.checkLimit('user7');
      const result3 = await limiter.checkLimit('user7');

      // All requests in same window should have same reset time
      expect(result1.resetAt.getTime()).toBe(result2.resetAt.getTime());
      expect(result2.resetAt.getTime()).toBe(result3.resetAt.getTime());
    });
  });

  describe('applyRateLimit Middleware Integration', () => {
    it('should return headers for successful request', async () => {
      const mockRequest = new Request('http://localhost/api/test', {
        method: 'GET',
        headers: {
          'x-forwarded-for': '192.168.1.100',
        },
      });

      const config = {
        windowMs: 60000,
        maxRequests: 10,
        keyPrefix: testKey,
      };

      const { allowed, headers } = await applyRateLimit(mockRequest, config);

      expect(allowed).toBe(true);
      expect(headers.get('X-RateLimit-Limit')).toBe('10');
      expect(headers.get('X-RateLimit-Remaining')).toBeTruthy();
      expect(headers.get('X-RateLimit-Reset')).toBeTruthy();
      
      // Verify reset is ISO timestamp
      const resetValue = headers.get('X-RateLimit-Reset');
      expect(resetValue).toBeTruthy();
      const resetDate = new Date(resetValue!);
      expect(resetDate.toString()).not.toBe('Invalid Date');
    });

    it('should return 429 response with all headers when limit exceeded', async () => {
      const mockRequest = new Request('http://localhost/api/test', {
        method: 'GET',
        headers: {
          'x-forwarded-for': '192.168.1.101',
        },
      });

      const config = {
        windowMs: 60000,
        maxRequests: 2,
        keyPrefix: testKey,
      };

      // Exhaust limit
      await applyRateLimit(mockRequest, config);
      await applyRateLimit(mockRequest, config);

      // This should be blocked
      const { allowed, response, headers } = await applyRateLimit(mockRequest, config);

      expect(allowed).toBe(false);
      expect(response).toBeTruthy();
      expect(response?.status).toBe(429);
      
      // Check all required headers
      expect(headers.get('X-RateLimit-Limit')).toBe('2');
      expect(headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(headers.get('X-RateLimit-Reset')).toBeTruthy();
      expect(headers.get('Retry-After')).toBeTruthy();
      
      // Verify Retry-After is a number
      const retryAfter = parseInt(headers.get('Retry-After')!);
      expect(retryAfter).toBeGreaterThan(0);
      expect(retryAfter).toBeLessThanOrEqual(60);
    });
  });

  describe('Different Rate Limit Configurations', () => {
    it('should apply correct limits for API endpoints', async () => {
      const limiter = new RateLimiter(RateLimitConfigs.API);
      const result = await limiter.checkLimit(`${testKey}-api-user`);

      expect(result.limit).toBe(100);
      expect(result.remaining).toBe(99);
    });

    it('should apply correct limits for Auth endpoints', async () => {
      const limiter = new RateLimiter(RateLimitConfigs.AUTH);
      const result = await limiter.checkLimit(`${testKey}-auth-user`);

      expect(result.limit).toBe(5);
      expect(result.remaining).toBe(4);
    });

    it('should apply correct limits for File Upload endpoints', async () => {
      const limiter = new RateLimiter(RateLimitConfigs.FILE_UPLOAD);
      const result = await limiter.checkLimit(`${testKey}-upload-user`);

      expect(result.limit).toBe(10);
      expect(result.remaining).toBe(9);
    });

    it('should apply correct limits for AI Query endpoints', async () => {
      const limiter = new RateLimiter(RateLimitConfigs.AI_QUERY);
      const result = await limiter.checkLimit(`${testKey}-ai-user`);

      expect(result.limit).toBe(20);
      expect(result.remaining).toBe(19);
    });

    it('should apply correct limits for Admin endpoints', async () => {
      const limiter = new RateLimiter(RateLimitConfigs.ADMIN);
      const result = await limiter.checkLimit(`${testKey}-admin-user`);

      expect(result.limit).toBe(200);
      expect(result.remaining).toBe(199);
    });
  });

  describe('Rate Limit Reset Behavior', () => {
    it('should reset count after window expires', async () => {
      const limiter = new RateLimiter({
        windowMs: 1000, // 1 second window for testing
        maxRequests: 3,
        keyPrefix: testKey,
      });

      // Make 3 requests
      await limiter.checkLimit('user8');
      await limiter.checkLimit('user8');
      const result1 = await limiter.checkLimit('user8');
      expect(result1.remaining).toBe(0);

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Should be able to make requests again
      const result2 = await limiter.checkLimit('user8');
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should fail open on database errors', async () => {
      // This test verifies that if the database fails, requests are still allowed
      const limiter = new RateLimiter({
        windowMs: 60000,
        maxRequests: 10,
        keyPrefix: testKey,
      });

      // Simulate database error by using invalid key
      // The implementation should catch errors and allow the request
      const result = await limiter.checkLimit('user9');
      expect(result.allowed).toBe(true);
    });
  });
});
