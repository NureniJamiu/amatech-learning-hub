/**
 * Environment Variable Validator
 * 
 * Validates all required environment variables at application startup
 * Fails fast with clear error messages if configuration is invalid
 */

import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  DIRECT_URL: z.string().url('DIRECT_URL must be a valid URL').optional(),
  
  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  
  // Grok API (Primary AI provider - using Groq)
  GROK_API_KEY: z.string()
    .startsWith('gsk_', 'GROK_API_KEY must start with "gsk_"')
    .min(10, 'GROK_API_KEY appears to be invalid'),
  GROK_API_BASE_URL: z.string().url('GROK_API_BASE_URL must be a valid URL').default('https://api.groq.com/openai/v1'),
  
  // Cloudinary (File storage)
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
  
  // OpenAI (Legacy - optional for backward compatibility)
  OPENAI_API_KEY: z.string().optional(),
  
  // Pinecone (Vector database)
  PINECONE_API_KEY: z.string().optional(),
  PINECONE_ENVIRONMENT: z.string().optional(),
  PINECONE_INDEX_NAME: z.string().optional(),
  
  // Application Config
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL').optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Throws an error if validation fails
 */
export function validateEnv(): EnvConfig {
  try {
    const result = envSchema.parse(process.env);
    
    // Log successful validation in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Environment variables validated successfully');
    }
    
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      console.error('');
      
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.');
        console.error(`  • ${path}: ${err.message}`);
      });
      
      console.error('');
      console.error('Please check your .env file and ensure all required variables are set.');
      console.error('See .env.example for reference.');
      
      process.exit(1);
    }
    
    throw error;
  }
}

/**
 * Get validated environment config
 * Safe to use after validateEnv() has been called
 */
export function getEnvConfig(): EnvConfig {
  return envSchema.parse(process.env);
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Sensitive keys that should be redacted in logs
 */
const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'apikey',
  'api_key',
  'authorization',
  'jwt',
  'bearer',
  'auth',
  'credential',
  'private',
  'key',
];

/**
 * Patterns for sensitive data in strings
 */
const SENSITIVE_PATTERNS = [
  /gsk_[a-zA-Z0-9]+/gi, // Grok API keys
  /sk-[a-zA-Z0-9]+/gi, // OpenAI API keys
  /Bearer\s+[a-zA-Z0-9\-._~+/]+=*/gi, // Bearer tokens
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, // Email addresses (optional)
];

/**
 * Redact sensitive data from any value
 */
export function redactSensitiveData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle strings
  if (typeof data === 'string') {
    return redactString(data);
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => redactSensitiveData(item));
  }

  // Handle objects
  if (typeof data === 'object') {
    const redacted: any = {};

    for (const key in data) {
      const lowerKey = key.toLowerCase();
      
      // Check if key is sensitive
      if (SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive))) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactSensitiveData(data[key]);
      }
    }

    return redacted;
  }

  return data;
}

/**
 * Redact sensitive patterns from strings
 */
function redactString(str: string): string {
  let redacted = str;

  for (const pattern of SENSITIVE_PATTERNS) {
    redacted = redacted.replace(pattern, '[REDACTED]');
  }

  return redacted;
}

/**
 * Redact API keys from strings
 * Shows first 4 and last 4 characters for debugging
 */
export function redactApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 12) {
    return '[REDACTED]';
  }

  const prefix = apiKey.substring(0, 4);
  const suffix = apiKey.substring(apiKey.length - 4);
  const middle = '*'.repeat(Math.min(apiKey.length - 8, 20));

  return `${prefix}${middle}${suffix}`;
}

/**
 * Redact password - shows only length
 */
export function redactPassword(password: string): string {
  if (!password) {
    return '[REDACTED]';
  }

  return `[REDACTED:${password.length} chars]`;
}

/**
 * Redact JWT token - shows header only
 */
export function redactToken(token: string): string {
  if (!token) {
    return '[REDACTED]';
  }

  const parts = token.split('.');
  if (parts.length === 3) {
    return `${parts[0]}.[REDACTED].[REDACTED]`;
  }

  return '[REDACTED]';
}

// Validate on module load (only in Node.js environment)
if (typeof window === 'undefined') {
  // Only validate if not in build process or test script
  const isTestScript = process.argv.some(arg => arg.includes('test-env-validation'));
  if (process.env.NEXT_PHASE !== 'phase-production-build' && !isTestScript) {
    try {
      validateEnv();
    } catch (error) {
      // Error already logged by validateEnv
    }
  }
}
