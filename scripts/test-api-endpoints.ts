/**
 * API Endpoint Testing Script
 * Tests critical API endpoints for production readiness
 */

interface TestResult {
  endpoint: string;
  method: string;
  passed: boolean;
  status?: number;
  message: string;
  duration?: number;
}

const results: TestResult[] = [];
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testEndpoint(
  endpoint: string,
  method: string = 'GET',
  options: RequestInit = {},
  expectedStatus: number = 200
): Promise<TestResult> {
  const startTime = Date.now();
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      ...options,
    });

    const duration = Date.now() - startTime;
    const passed = response.status === expectedStatus;

    let message = `HTTP ${response.status}`;
    if (response.ok) {
      try {
        const data = await response.json();
        if (data.success !== undefined) {
          message += ` - Success: ${data.success}`;
        }
      } catch {
        // Response might not be JSON
      }
    }

    const result: TestResult = {
      endpoint,
      method,
      passed,
      status: response.status,
      message,
      duration,
    };

    results.push(result);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const result: TestResult = {
      endpoint,
      method,
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration,
    };

    results.push(result);
    return result;
  }
}

async function testHealthEndpoints() {
  log('\n=== Testing Health Endpoints ===', colors.cyan);

  const result = await testEndpoint('/api/health', 'GET');
  const icon = result.passed ? '✓' : '✗';
  const color = result.passed ? colors.green : colors.red;
  log(`${icon} ${result.endpoint}: ${result.message} (${result.duration}ms)`, color);
}

async function testAuthEndpoints() {
  log('\n=== Testing Auth Endpoints ===', colors.cyan);

  // Test login endpoint with invalid credentials (should return 401)
  const loginResult = await testEndpoint(
    '/api/v1/auth/login',
    'POST',
    {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    },
    401
  );

  const icon = loginResult.passed ? '✓' : '✗';
  const color = loginResult.passed ? colors.green : colors.red;
  log(
    `${icon} ${loginResult.endpoint}: ${loginResult.message} (${loginResult.duration}ms)`,
    color
  );
}

async function testProtectedEndpoints() {
  log('\n=== Testing Protected Endpoints (Without Auth) ===', colors.cyan);

  const endpoints = [
    '/api/v1/user/profile',
    '/api/v1/courses',
    '/api/v1/materials',
  ];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint, 'GET', {}, 401);
    const icon = result.passed ? '✓' : '✗';
    const color = result.passed ? colors.green : colors.red;
    log(`${icon} ${result.endpoint}: ${result.message} (${result.duration}ms)`, color);
  }
}

async function testRateLimitHeaders() {
  log('\n=== Testing Rate Limit Headers ===', colors.cyan);

  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const headers = response.headers;

    const rateLimitHeaders = {
      'x-ratelimit-limit': headers.get('x-ratelimit-limit'),
      'x-ratelimit-remaining': headers.get('x-ratelimit-remaining'),
      'x-ratelimit-reset': headers.get('x-ratelimit-reset'),
    };

    if (rateLimitHeaders['x-ratelimit-limit']) {
      log('✓ Rate limit headers present:', colors.green);
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        if (value) {
          log(`  ${key}: ${value}`, colors.green);
        }
      });
    } else {
      log('✗ Rate limit headers missing', colors.red);
    }
  } catch (error) {
    log(`✗ Failed to check rate limit headers: ${error}`, colors.red);
  }
}

async function testErrorHandling() {
  log('\n=== Testing Error Handling ===', colors.cyan);

  // Test invalid JSON
  const invalidJsonResult = await testEndpoint(
    '/api/v1/auth/login',
    'POST',
    {
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json',
    },
    400
  );

  const icon = invalidJsonResult.passed ? '✓' : '✗';
  const color = invalidJsonResult.passed ? colors.green : colors.red;
  log(
    `${icon} Invalid JSON handling: ${invalidJsonResult.message} (${invalidJsonResult.duration}ms)`,
    color
  );

  // Test missing required fields
  const missingFieldsResult = await testEndpoint(
    '/api/v1/auth/login',
    'POST',
    {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    },
    400
  );

  const icon2 = missingFieldsResult.passed ? '✓' : '✗';
  const color2 = missingFieldsResult.passed ? colors.green : colors.red;
  log(
    `${icon2} Missing fields validation: ${missingFieldsResult.message} (${missingFieldsResult.duration}ms)`,
    color2
  );
}

async function printSummary() {
  log('\n' + '='.repeat(60), colors.cyan);
  log('API TEST SUMMARY', colors.cyan);
  log('='.repeat(60), colors.cyan);

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  log(`\nTotal Tests: ${total}`);
  log(`Passed: ${passed}`, colors.green);
  log(`Failed: ${failed}`, failed > 0 ? colors.red : colors.green);
  log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  if (failed > 0) {
    log('Failed Tests:', colors.red);
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        log(`  ✗ ${r.method} ${r.endpoint}: ${r.message}`, colors.red);
      });
  }

  log('\n' + '='.repeat(60), colors.cyan);
}

async function main() {
  log('Starting API Endpoint Tests...', colors.cyan);
  log(`Base URL: ${BASE_URL}`, colors.yellow);
  log('='.repeat(60), colors.cyan);

  await testHealthEndpoints();
  await testAuthEndpoints();
  await testProtectedEndpoints();
  await testRateLimitHeaders();
  await testErrorHandling();

  await printSummary();

  const failedCount = results.filter((r) => !r.passed).length;
  process.exit(failedCount > 0 ? 1 : 0);
}

main();
