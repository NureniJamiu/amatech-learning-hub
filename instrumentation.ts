/**
 * Next.js Instrumentation
 * 
 * This file runs once when the Next.js server starts
 * Perfect place for environment validation and initialization
 */

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnv } = await import('./src/lib/env-validator');
    const { enforceProductionSettings } = await import('./src/lib/config');
    
    try {
      // Validate environment variables
      console.log('🔍 Validating environment configuration...');
      validateEnv();
      
      // Enforce production settings if in production
      enforceProductionSettings();
      
      console.log('✅ Application initialized successfully');
    } catch (error) {
      console.error('❌ Application initialization failed');
      // Error details already logged by validation functions
      process.exit(1);
    }
  }
}
