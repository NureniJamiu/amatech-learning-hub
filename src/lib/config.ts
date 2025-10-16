/**
 * Environment-Specific Configuration
 * 
 * Provides configuration objects for different environments
 * Enforces production settings in production environment
 */

import { getEnvConfig, isProduction, isDevelopment, isTest } from './env-validator';

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  
  // API Configuration
  api: {
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  
  // Rate Limiting
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
  
  // File Upload
  upload: {
    maxFileSize: number; // in bytes
    allowedTypes: string[];
    maxFilesPerRequest: number;
  };
  
  // PDF Processing
  pdfProcessing: {
    chunkSize: number;
    chunkOverlap: number;
    maxContextLength: number;
    batchSize: number;
  };
  
  // Caching
  cache: {
    enabled: boolean;
    ttl: {
      course: number; // in seconds
      material: number;
      user: number;
    };
  };
  
  // Logging
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    redactSensitive: boolean;
    logRequests: boolean;
    logErrors: boolean;
  };
  
  // Security
  security: {
    enforceHttps: boolean;
    secureCookies: boolean;
    csrfProtection: boolean;
    helmetEnabled: boolean;
  };
  
  // Queue Processing
  queue: {
    pollInterval: number; // in milliseconds
    maxConcurrent: number;
    maxRetries: number;
    retryDelay: number;
  };
  
  // AI/Grok
  ai: {
    timeout: number;
    maxRetries: number;
    temperature: number;
    maxTokens: number;
  };
}

/**
 * Development Configuration
 */
const developmentConfig: AppConfig = {
  env: 'development',
  
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 2,
    retryDelay: 1000,
  },
  
  rateLimit: {
    enabled: false, // Disabled in development for easier testing
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
  },
  
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
    maxFilesPerRequest: 5,
  },
  
  pdfProcessing: {
    chunkSize: 1000,
    chunkOverlap: 200,
    maxContextLength: 4000,
    batchSize: 10,
  },
  
  cache: {
    enabled: true,
    ttl: {
      course: 300, // 5 minutes
      material: 60, // 1 minute
      user: 300,
    },
  },
  
  logging: {
    level: 'debug',
    redactSensitive: true,
    logRequests: true,
    logErrors: true,
  },
  
  security: {
    enforceHttps: false,
    secureCookies: false,
    csrfProtection: false,
    helmetEnabled: false,
  },
  
  queue: {
    pollInterval: 5000, // 5 seconds
    maxConcurrent: 2,
    maxRetries: 3,
    retryDelay: 5000,
  },
  
  ai: {
    timeout: 30000,
    maxRetries: 3,
    temperature: 0.7,
    maxTokens: 1000,
  },
};

/**
 * Production Configuration
 */
const productionConfig: AppConfig = {
  env: 'production',
  
  api: {
    timeout: 15000, // 15 seconds (stricter)
    retryAttempts: 3,
    retryDelay: 2000,
  },
  
  rateLimit: {
    enabled: true, // MUST be enabled in production
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
    maxFilesPerRequest: 3,
  },
  
  pdfProcessing: {
    chunkSize: 1000,
    chunkOverlap: 200,
    maxContextLength: 4000,
    batchSize: 5, // Smaller batches in production
  },
  
  cache: {
    enabled: true,
    ttl: {
      course: 3600, // 1 hour
      material: 300, // 5 minutes
      user: 1800, // 30 minutes
    },
  },
  
  logging: {
    level: 'info',
    redactSensitive: true, // MUST be true in production
    logRequests: true,
    logErrors: true,
  },
  
  security: {
    enforceHttps: true, // MUST be true in production
    secureCookies: true, // MUST be true in production
    csrfProtection: true,
    helmetEnabled: true,
  },
  
  queue: {
    pollInterval: 10000, // 10 seconds
    maxConcurrent: 5,
    maxRetries: 3,
    retryDelay: 10000,
  },
  
  ai: {
    timeout: 20000,
    maxRetries: 3,
    temperature: 0.7,
    maxTokens: 1000,
  },
};

/**
 * Test Configuration
 */
const testConfig: AppConfig = {
  env: 'test',
  
  api: {
    timeout: 5000, // Shorter for tests
    retryAttempts: 1,
    retryDelay: 100,
  },
  
  rateLimit: {
    enabled: false, // Disabled for tests
    windowMs: 15 * 60 * 1000,
    maxRequests: 1000,
  },
  
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB for tests
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
    maxFilesPerRequest: 2,
  },
  
  pdfProcessing: {
    chunkSize: 500, // Smaller for tests
    chunkOverlap: 100,
    maxContextLength: 2000,
    batchSize: 5,
  },
  
  cache: {
    enabled: false, // Disabled for tests
    ttl: {
      course: 60,
      material: 30,
      user: 60,
    },
  },
  
  logging: {
    level: 'error', // Only errors in tests
    redactSensitive: true,
    logRequests: false,
    logErrors: true,
  },
  
  security: {
    enforceHttps: false,
    secureCookies: false,
    csrfProtection: false,
    helmetEnabled: false,
  },
  
  queue: {
    pollInterval: 1000, // 1 second for tests
    maxConcurrent: 1,
    maxRetries: 1,
    retryDelay: 100,
  },
  
  ai: {
    timeout: 5000,
    maxRetries: 1,
    temperature: 0.7,
    maxTokens: 500,
  },
};

/**
 * Get configuration for current environment
 */
export function getConfig(): AppConfig {
  if (isProduction()) {
    return productionConfig;
  }
  
  if (isTest()) {
    return testConfig;
  }
  
  return developmentConfig;
}

/**
 * Enforce production settings
 * Throws error if critical production settings are not enabled
 */
export function enforceProductionSettings(): void {
  if (!isProduction()) {
    return;
  }
  
  const config = getConfig();
  const errors: string[] = [];
  
  // Check critical security settings
  if (!config.security.enforceHttps) {
    errors.push('HTTPS must be enforced in production');
  }
  
  if (!config.security.secureCookies) {
    errors.push('Secure cookies must be enabled in production');
  }
  
  if (!config.logging.redactSensitive) {
    errors.push('Sensitive data redaction must be enabled in production');
  }
  
  if (!config.rateLimit.enabled) {
    errors.push('Rate limiting must be enabled in production');
  }
  
  // Check environment variables
  const env = getEnvConfig();
  
  if (!env.GROK_API_KEY) {
    errors.push('GROK_API_KEY must be set in production');
  }
  
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters in production');
  }
  
  if (!env.DATABASE_URL) {
    errors.push('DATABASE_URL must be set in production');
  }
  
  if (errors.length > 0) {
    console.error('❌ Production configuration validation failed:');
    console.error('');
    errors.forEach(error => {
      console.error(`  • ${error}`);
    });
    console.error('');
    process.exit(1);
  }
  
  console.log('✅ Production settings validated successfully');
}

/**
 * Get environment-specific feature flags
 */
export function getFeatureFlags() {
  const config = getConfig();
  
  return {
    rateLimitingEnabled: config.rateLimit.enabled,
    cachingEnabled: config.cache.enabled,
    csrfProtectionEnabled: config.security.csrfProtection,
    requestLoggingEnabled: config.logging.logRequests,
  };
}

// Enforce production settings on module load
if (typeof window === 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
  const isTestScript = process.argv.some(arg => arg.includes('test-env-validation'));
  if (!isTestScript) {
    try {
      enforceProductionSettings();
    } catch (error) {
      // Error already logged
    }
  }
}
