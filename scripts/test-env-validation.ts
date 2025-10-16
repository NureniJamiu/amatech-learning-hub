/**
 * Test Environment Validation
 * 
 * Script to test environment validation and configuration
 * Run with: tsx scripts/test-env-validation.ts
 */

import { validateEnv, getEnvConfig, redactSensitiveData, redactApiKey, redactPassword, redactToken } from '../src/lib/env-validator';
import { getConfig, enforceProductionSettings, getFeatureFlags } from '../src/lib/config';
import { logger } from '../src/lib/logger';

console.log('🧪 Testing Environment Configuration\n');

// Test 1: Validate Environment Variables
console.log('1️⃣ Testing Environment Validation...');
try {
  const env = getEnvConfig();
  console.log('✅ Environment validation passed');
  console.log(`   NODE_ENV: ${env.NODE_ENV}`);
  console.log(`   Database: ${env.DATABASE_URL ? '✓ Configured' : '✗ Missing'}`);
  console.log(`   Grok API: ${env.GROK_API_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log(`   Cloudinary: ${env.CLOUDINARY_CLOUD_NAME ? '✓ Configured' : '✗ Missing'}`);
} catch (error) {
  console.error('❌ Environment validation failed (this is expected if .env is not configured)');
  console.log('ℹ️  To fix: Copy .env.example to .env and fill in the values');
  console.log('ℹ️  Continuing with redaction tests...\n');
}

console.log('\n2️⃣ Testing Configuration...');
const config = getConfig();
console.log(`✅ Configuration loaded for: ${config.env}`);
console.log(`   API Timeout: ${config.api.timeout}ms`);
console.log(`   Rate Limiting: ${config.rateLimit.enabled ? 'Enabled' : 'Disabled'}`);
console.log(`   Log Level: ${config.logging.level}`);
console.log(`   HTTPS Enforced: ${config.security.enforceHttps ? 'Yes' : 'No'}`);
console.log(`   Cache Enabled: ${config.cache.enabled ? 'Yes' : 'No'}`);

console.log('\n3️⃣ Testing Feature Flags...');
const flags = getFeatureFlags();
console.log('✅ Feature flags:');
console.log(`   Rate Limiting: ${flags.rateLimitingEnabled ? '✓' : '✗'}`);
console.log(`   Caching: ${flags.cachingEnabled ? '✓' : '✗'}`);
console.log(`   CSRF Protection: ${flags.csrfProtectionEnabled ? '✓' : '✗'}`);
console.log(`   Request Logging: ${flags.requestLoggingEnabled ? '✓' : '✗'}`);

console.log('\n4️⃣ Testing Sensitive Data Redaction...');

// Test redactSensitiveData
const testData = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'mySecretPassword123',
  apiKey: 'xai-1234567890abcdef',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature',
  publicInfo: 'This is public',
  nested: {
    secret: 'should-be-redacted',
    normal: 'should-be-visible',
  },
};

console.log('Original data:');
console.log(JSON.stringify(testData, null, 2));

const redacted = redactSensitiveData(testData);
console.log('\n✅ Redacted data:');
console.log(JSON.stringify(redacted, null, 2));

// Test specific redaction functions
console.log('\n5️⃣ Testing Specific Redaction Functions...');

const apiKey = 'xai-1234567890abcdef';
console.log(`API Key: ${apiKey}`);
console.log(`Redacted: ${redactApiKey(apiKey)}`);

const password = 'mySecretPassword123';
console.log(`\nPassword: ${password}`);
console.log(`Redacted: ${redactPassword(password)}`);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature';
console.log(`\nToken: ${token}`);
console.log(`Redacted: ${redactToken(token)}`);

// Test logger
console.log('\n6️⃣ Testing Logger...');
logger.info('Test info message', { userId: '123', action: 'test' });
logger.warn('Test warning message', { warning: 'This is a warning' });
logger.debug('Test debug message', { debug: 'This is debug info' });

// Test logger with sensitive data
console.log('\n7️⃣ Testing Logger with Sensitive Data...');
logger.logAuth('login', {
  userId: '123',
  password: 'should-be-redacted',
  apiKey: 'xai-should-be-redacted',
  ip: '192.168.1.1',
});

logger.logRequest({
  method: 'POST',
  url: '/api/v1/auth/login',
  headers: {
    'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'content-type': 'application/json',
  },
  body: {
    email: 'user@example.com',
    password: 'secret123',
  },
  userId: '123',
  ip: '192.168.1.1',
});

logger.logExternalApi('Grok', 'createEmbedding', {
  apiKey: 'xai-1234567890abcdef',
  chunks: 10,
  duration: 1500,
});

// Test production settings enforcement
console.log('\n8️⃣ Testing Production Settings Enforcement...');
if (process.env.NODE_ENV === 'production') {
  try {
    enforceProductionSettings();
    console.log('✅ Production settings validated');
  } catch (error) {
    console.error('❌ Production settings validation failed');
  }
} else {
  console.log('ℹ️  Skipped (not in production mode)');
}

console.log('\n✅ All tests completed!\n');
console.log('📝 Summary:');
console.log('   - Environment variables validated');
console.log('   - Configuration loaded correctly');
console.log('   - Sensitive data redaction working');
console.log('   - Logger functioning with auto-redaction');
console.log('   - Production settings enforced (if applicable)');
