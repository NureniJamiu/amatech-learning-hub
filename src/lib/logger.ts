/**
 * Secure Logger Utility
 * 
 * Provides logging functionality with automatic sensitive data redaction
 * Respects environment-specific logging levels
 */

import { getConfig } from './config';
import { redactSensitiveData, redactApiKey, redactPassword, redactToken } from './env-validator';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  userId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  [key: string]: any;
}

class Logger {
  private config = getConfig();

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const configLevel = this.config.logging.level;
    
    const currentLevelIndex = levels.indexOf(level);
    const configLevelIndex = levels.indexOf(configLevel);
    
    return currentLevelIndex >= configLevelIndex;
  }

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const levelUpper = level.toUpperCase().padEnd(5);
    
    let formatted = `[${timestamp}] ${levelUpper} ${message}`;
    
    if (context) {
      const redactedContext = this.config.logging.redactSensitive
        ? redactSensitiveData(context)
        : context;
      
      formatted += ` ${JSON.stringify(redactedContext)}`;
    }
    
    return formatted;
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorContext = {
        ...context,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : error,
      };
      
      console.error(this.formatMessage('error', message, errorContext));
    }
  }

  /**
   * Log API request
   */
  logRequest(req: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
    userId?: string;
    ip?: string;
  }): void {
    if (!this.config.logging.logRequests) {
      return;
    }

    const context: LogContext = {
      method: req.method,
      endpoint: req.url,
      userId: req.userId,
      ip: req.ip,
    };

    // Redact sensitive headers
    if (req.headers) {
      const redactedHeaders = { ...req.headers };
      if (redactedHeaders.authorization) {
        redactedHeaders.authorization = redactToken(redactedHeaders.authorization);
      }
      if (redactedHeaders.cookie) {
        redactedHeaders.cookie = '[REDACTED]';
      }
      context.headers = redactedHeaders;
    }

    // Redact sensitive body fields
    if (req.body) {
      context.body = this.config.logging.redactSensitive
        ? redactSensitiveData(req.body)
        : req.body;
    }

    this.info('API Request', context);
  }

  /**
   * Log API response
   */
  logResponse(res: {
    statusCode: number;
    duration: number;
    endpoint: string;
    method: string;
    userId?: string;
  }): void {
    if (!this.config.logging.logRequests) {
      return;
    }

    const context: LogContext = {
      method: res.method,
      endpoint: res.endpoint,
      statusCode: res.statusCode,
      duration: res.duration,
      userId: res.userId,
    };

    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    
    if (level === 'error') {
      this.error('API Response', undefined, context);
    } else if (level === 'warn') {
      this.warn('API Response', context);
    } else {
      this.info('API Response', context);
    }
  }

  /**
   * Log authentication event
   */
  logAuth(event: 'login' | 'logout' | 'signup' | 'token_refresh' | 'auth_failed', context: LogContext): void {
    // Always redact passwords in auth logs
    const redactedContext = redactSensitiveData(context);
    
    this.info(`Auth: ${event}`, redactedContext);
  }

  /**
   * Log database operation
   */
  logDatabase(operation: string, context: LogContext): void {
    this.debug(`Database: ${operation}`, context);
  }

  /**
   * Log external API call
   */
  logExternalApi(service: string, operation: string, context: LogContext): void {
    // Redact API keys
    const redactedContext = { ...context };
    if (redactedContext.apiKey) {
      redactedContext.apiKey = redactApiKey(redactedContext.apiKey);
    }
    
    this.info(`External API: ${service} - ${operation}`, redactedContext);
  }

  /**
   * Log file operation
   */
  logFile(operation: string, context: LogContext): void {
    this.info(`File: ${operation}`, context);
  }

  /**
   * Log queue operation
   */
  logQueue(operation: string, context: LogContext): void {
    this.info(`Queue: ${operation}`, context);
  }

  /**
   * Log security event
   */
  logSecurity(event: string, context: LogContext): void {
    this.warn(`Security: ${event}`, context);
  }

  /**
   * Log performance metric
   */
  logPerformance(metric: string, value: number, context?: LogContext): void {
    this.debug(`Performance: ${metric}`, { ...context, value });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logError = (message: string, error?: Error | unknown, context?: LogContext) => logger.error(message, error, context);

export const logRequest = (req: Parameters<typeof logger.logRequest>[0]) => logger.logRequest(req);
export const logResponse = (res: Parameters<typeof logger.logResponse>[0]) => logger.logResponse(res);
export const logAuth = (event: Parameters<typeof logger.logAuth>[0], context: LogContext) => logger.logAuth(event, context);
export const logDatabase = (operation: string, context: LogContext) => logger.logDatabase(operation, context);
export const logExternalApi = (service: string, operation: string, context: LogContext) => logger.logExternalApi(service, operation, context);
export const logFile = (operation: string, context: LogContext) => logger.logFile(operation, context);
export const logQueue = (operation: string, context: LogContext) => logger.logQueue(operation, context);
export const logSecurity = (event: string, context: LogContext) => logger.logSecurity(event, context);
export const logPerformance = (metric: string, value: number, context?: LogContext) => logger.logPerformance(metric, value, context);
