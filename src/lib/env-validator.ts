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
  
  // Grok API (Primary AI provider)
  GROK_API_KEY: z.string()
    .startsWith('xai-', 'GROK_API_KEY must start with "xai-"')
    .min(10, 'GROK_API_KEY appears to be invalid'),
  GROK_API_BASE_URL: z.string().url('GROK_API_BASE_URL must be a valid URL').default('https://api.x.ai/v1'),
  
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
 * Redact sensitive data from logs
 */
export function redactSensitiveData(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apiKey',
    'api_key',
    'authorization',
    'jwt',
    'bearer',
  ];

  const redacted = { ...data };

  for (const key in redacted) {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      if (typeof redacted[key] === 'string') {
        redacted[key] = '[REDACTED]';
      }
    } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      redacted[key] = redactSensitiveData(redacted[key]);
    }
  }

  return redacted;
}

// Validate on module load (only in Node.js environment)
if (typeof window === 'undefined') {
  // Only validate if not in build process
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    try {
      validateEnv();
    } catch (error) {
      // Error already logged by validateEnv
    }
  }
}
