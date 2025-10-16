/**
 * Verification Script for Rate Limit Headers Implementation
 * 
 * This script verifies that rate limit headers are correctly implemented
 * by testing the core functionality without requiring a test framework.
 */

import { RateLimiter, RateLimitConfigs } from '../src/lib/rate-limiter';
import { applyRateLimit } from '../src/middleware/rate-limit.middleware';

async function verifyRateLimitHeaders() {
  console.log('🔍 Verifying Rate Limit Headers Implementation...\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Verify RateLimitResult includes all required fields
  console.log('Test 1: Verify RateLimitResult structure');
  try {
    const limiter = new RateLimiter({
      windowMs: 60000,
      maxRequests: 10,
      keyPrefix: 'test-verify',
    });

    const result = await limiter.checkLimit('test-user-1');

    if (typeof result.allowed !== 'boolean') {
      throw new Error('Missing or invalid "allowed" field');
    }
    if (typeof result.remaining !== 'number') {
      throw new Error('Missing or invalid "remaining" field');
    }
    if (!(result.resetAt instanceof Date)) {
      throw new Error('Missing or invalid "resetAt" field');
    }
    if (typeof result.limit !== 'number') {
      throw new Error('Missing or invalid "limit" field');
    }

    console.log('✅ PASSED: RateLimitResult has all required fields');
    console.log(`   - allowed: ${result.allowed}`);
    console.log(`   - remaining: ${result.remaining}`);
    console.log(`   - resetAt: ${result.resetAt.toISOString()}`);
    console.log(`   - limit: ${result.limit}\n`);
    passed++;
  } catch (error) {
    console.log(`❌ FAILED: ${(error as Error).message}\n`);
    failed++;
  }

  // Test 2: Verify remaining count decrements
  console.log('Test 2: Verify remaining count decrements');
  try {
    const limiter = new RateLimiter({
      windowMs: 60000,
      maxRequests: 5,
      keyPrefix: 'test-verify',
    });

    const result1 = await limiter.checkLimit('test-user-2');
    const result2 = await limiter.checkLimit('test-user-2');
    const result3 = await limiter.checkLimit('test-user-2');

    if (result1.remaining !== 4) {
      throw new Error(`Expected remaining=4, got ${result1.remaining}`);
    }
    if (result2.remaining !== 3) {
      throw new Error(`Expected remaining=3, got ${result2.remaining}`);
    }
    if (result3.remaining !== 2) {
      throw new Error(`Expected remaining=2, got ${result3.remaining}`);
    }

    console.log('✅ PASSED: Remaining count decrements correctly');
    console.log(`   - Request 1: ${result1.remaining} remaining`);
    console.log(`   - Request 2: ${result2.remaining} remaining`);
    console.log(`   - Request 3: ${result3.remaining} remaining\n`);
    passed++;
  } catch (error) {
    console.log(`❌ FAILED: ${(error as Error).message}\n`);
    failed++;
  }

  // Test 3: Verify rate limit exceeded behavior
  console.log('Test 3: Verify rate limit exceeded (allowed=false)');
  try {
    const limiter = new RateLimiter({
      windowMs: 60000,
      maxRequests: 2,
      keyPrefix: 'test-verify',
    });

    await limiter.checkLimit('test-user-3');
    await limiter.checkLimit('test-user-3');
    const result = await limiter.checkLimit('test-user-3');

    if (result.allowed !== false) {
      throw new Error('Expected allowed=false when limit exceeded');
    }
    if (result.remaining !== 0) {
      throw new Error(`Expected remaining=0, got ${result.remaining}`);
    }

    console.log('✅ PASSED: Rate limit exceeded returns allowed=false');
    console.log(`   - allowed: ${result.allowed}`);
    console.log(`   - remaining: ${result.remaining}\n`);
    passed++;
  } catch (error) {
    console.log(`❌ FAILED: ${(error as Error).message}\n`);
    failed++;
  }

  // Test 4: Verify resetAt is in the future
  console.log('Test 4: Verify resetAt is in the future');
  try {
    const limiter = new RateLimiter({
      windowMs: 60000,
      maxRequests: 10,
      keyPrefix: 'test-verify',
    });

    const now = new Date();
    const result = await limiter.checkLimit('test-user-4');

    if (result.resetAt.getTime() <= now.getTime()) {
      throw new Error('resetAt should be in the future');
    }

    const diffMs = result.resetAt.getTime() - now.getTime();
    if (diffMs > 60000) {
      throw new Error('resetAt is too far in the future');
    }

    console.log('✅ PASSED: resetAt is correctly set in the future');
    console.log(`   - Current time: ${now.toISOString()}`);
    console.log(`   - Reset time: ${result.resetAt.toISOString()}`);
    console.log(`   - Difference: ${Math.ceil(diffMs / 1000)} seconds\n`);
    passed++;
  } catch (error) {
    console.log(`❌ FAILED: ${(error as Error).message}\n`);
    failed++;
  }

  // Test 5: Verify applyRateLimit returns headers
  console.log('Test 5: Verify applyRateLimit returns headers');
  try {
    const mockRequest = new Request('http://localhost/api/test', {
      method: 'GET',
      headers: {
        'x-forwarded-for': '192.168.1.200',
      },
    });

    const config = {
      windowMs: 60000,
      maxRequests: 10,
      keyPrefix: 'test-verify',
    };

    const { allowed, headers } = await applyRateLimit(mockRequest, config);

    if (!allowed) {
      throw new Error('Expected request to be allowed');
    }

    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');

    if (!limit) throw new Error('Missing X-RateLimit-Limit header');
    if (!remaining) throw new Error('Missing X-RateLimit-Remaining header');
    if (!reset) throw new Error('Missing X-RateLimit-Reset header');

    // Verify reset is valid ISO timestamp
    const resetDate = new Date(reset);
    if (resetDate.toString() === 'Invalid Date') {
      throw new Error('X-RateLimit-Reset is not a valid ISO timestamp');
    }

    console.log('✅ PASSED: applyRateLimit returns all required headers');
    console.log(`   - X-RateLimit-Limit: ${limit}`);
    console.log(`   - X-RateLimit-Remaining: ${remaining}`);
    console.log(`   - X-RateLimit-Reset: ${reset}\n`);
    passed++;
  } catch (error) {
    console.log(`❌ FAILED: ${(error as Error).message}\n`);
    failed++;
  }

  // Test 6: Verify 429 response includes Retry-After
  console.log('Test 6: Verify 429 response includes Retry-After header');
  try {
    const mockRequest = new Request('http://localhost/api/test', {
      method: 'GET',
      headers: {
        'x-forwarded-for': '192.168.1.201',
      },
    });

    const config = {
      windowMs: 60000,
      maxRequests: 2,
      keyPrefix: 'test-verify',
    };

    // Exhaust limit
    await applyRateLimit(mockRequest, config);
    await applyRateLimit(mockRequest, config);

    // This should be blocked
    const { allowed, response, headers } = await applyRateLimit(mockRequest, config);

    if (allowed) {
      throw new Error('Expected request to be blocked');
    }
    if (!response) {
      throw new Error('Expected response object');
    }
    if (response.status !== 429) {
      throw new Error(`Expected status 429, got ${response.status}`);
    }

    const retryAfter = headers.get('Retry-After');
    if (!retryAfter) {
      throw new Error('Missing Retry-After header');
    }

    const retryAfterSeconds = parseInt(retryAfter);
    if (isNaN(retryAfterSeconds) || retryAfterSeconds <= 0) {
      throw new Error('Retry-After should be a positive number');
    }

    console.log('✅ PASSED: 429 response includes Retry-After header');
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Retry-After: ${retryAfter} seconds`);
    console.log(`   - X-RateLimit-Remaining: ${headers.get('X-RateLimit-Remaining')}\n`);
    passed++;
  } catch (error) {
    console.log(`❌ FAILED: ${(error as Error).message}\n`);
    failed++;
  }

  // Test 7: Verify predefined configurations
  console.log('Test 7: Verify predefined rate limit configurations');
  try {
    const configs = [
      { name: 'API', config: RateLimitConfigs.API, expectedLimit: 100 },
      { name: 'AUTH', config: RateLimitConfigs.AUTH, expectedLimit: 5 },
      { name: 'FILE_UPLOAD', config: RateLimitConfigs.FILE_UPLOAD, expectedLimit: 10 },
      { name: 'AI_QUERY', config: RateLimitConfigs.AI_QUERY, expectedLimit: 20 },
      { name: 'ADMIN', config: RateLimitConfigs.ADMIN, expectedLimit: 200 },
    ];

    for (const { name, config, expectedLimit } of configs) {
      const limiter = new RateLimiter(config);
      const result = await limiter.checkLimit(`test-verify-${name.toLowerCase()}`);

      if (result.limit !== expectedLimit) {
        throw new Error(`${name}: Expected limit=${expectedLimit}, got ${result.limit}`);
      }
    }

    console.log('✅ PASSED: All predefined configurations are correct');
    configs.forEach(({ name, expectedLimit }) => {
      console.log(`   - ${name}: ${expectedLimit} requests`);
    });
    console.log();
    passed++;
  } catch (error) {
    console.log(`❌ FAILED: ${(error as Error).message}\n`);
    failed++;
  }

  // Summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 VERIFICATION SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);
  console.log('═══════════════════════════════════════════════════════\n');

  if (failed === 0) {
    console.log('🎉 All verifications passed! Rate limit headers are correctly implemented.');
    console.log('\n✅ Implementation includes:');
    console.log('   - X-RateLimit-Limit header');
    console.log('   - X-RateLimit-Remaining header');
    console.log('   - X-RateLimit-Reset header (ISO timestamp)');
    console.log('   - Retry-After header (when limit exceeded)');
    console.log('   - 429 status code (when limit exceeded)');
  } else {
    console.log('⚠️  Some verifications failed. Please review the implementation.');
    process.exit(1);
  }

  // Cleanup
  console.log('\n🧹 Cleaning up test data...');
  const { default: prisma } = await import('../src/lib/prisma');
  await prisma.rateLimit.deleteMany({
    where: { key: { contains: 'test-verify' } },
  });
  console.log('✅ Cleanup complete');
}

// Run verification
verifyRateLimitHeaders()
  .then(() => {
    console.log('\n✨ Verification complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Verification failed with error:', error);
    process.exit(1);
  });
