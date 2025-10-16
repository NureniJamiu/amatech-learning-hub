import { toast } from "react-toastify";
import { Prisma } from "@/app/generated/prisma";

/**
 * Standard error types for the application
 */
export enum ErrorType {
  VALIDATION = "VALIDATION",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  NOT_FOUND = "NOT_FOUND",
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  DATABASE = "DATABASE",
  EXTERNAL_API = "EXTERNAL_API",
  FILE_UPLOAD = "FILE_UPLOAD",
  RATE_LIMIT = "RATE_LIMIT",
  UNKNOWN = "UNKNOWN"
}

/**
 * Specific error codes for better error tracking
 */
export enum ErrorCode {
  // Authentication errors (AUTH_xxx)
  AUTH_MISSING_TOKEN = "AUTH_001",
  AUTH_INVALID_TOKEN = "AUTH_002",
  AUTH_EXPIRED_TOKEN = "AUTH_003",
  AUTH_INVALID_CREDENTIALS = "AUTH_004",
  AUTH_SESSION_NOT_FOUND = "AUTH_005",
  
  // Validation errors (VAL_xxx)
  VAL_INVALID_INPUT = "VAL_001",
  VAL_MISSING_FIELD = "VAL_002",
  VAL_INVALID_FORMAT = "VAL_003",
  VAL_FILE_TOO_LARGE = "VAL_004",
  VAL_INVALID_FILE_TYPE = "VAL_005",
  
  // Database errors (DB_xxx)
  DB_UNIQUE_CONSTRAINT = "DB_001",
  DB_NOT_FOUND = "DB_002",
  DB_FOREIGN_KEY_CONSTRAINT = "DB_003",
  DB_CONNECTION_ERROR = "DB_004",
  DB_QUERY_ERROR = "DB_005",
  
  // External API errors (API_xxx)
  API_GROK_ERROR = "API_001",
  API_CLOUDINARY_ERROR = "API_002",
  API_TIMEOUT = "API_003",
  API_RATE_LIMIT = "API_004",
  
  // File upload errors (FILE_xxx)
  FILE_UPLOAD_FAILED = "FILE_001",
  FILE_PROCESSING_FAILED = "FILE_002",
  FILE_CLEANUP_FAILED = "FILE_003",
  
  // PDF processing errors (PDF_xxx)
  PDF_PARSE_ERROR = "PDF_001",
  PDF_EXTRACTION_ERROR = "PDF_002",
  PDF_EMBEDDING_ERROR = "PDF_003",
  
  // Rate limit errors (RATE_xxx)
  RATE_LIMIT_EXCEEDED = "RATE_001",
  
  // General errors
  INTERNAL_ERROR = "INT_001",
  UNKNOWN_ERROR = "UNK_001",
}

/**
 * Enhanced error class with additional context
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);

    this.type = type;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, AppError);
  }
}

/**
 * Factory functions for creating specific error types
 */
export const createError = {
  validation: (message: string, code: ErrorCode = ErrorCode.VAL_INVALID_INPUT, context?: Record<string, any>) =>
    new AppError(message, code, ErrorType.VALIDATION, 400, true, context),

  authentication: (message: string = "Authentication required", code: ErrorCode = ErrorCode.AUTH_INVALID_TOKEN) =>
    new AppError(message, code, ErrorType.AUTHENTICATION, 401, true),

  authorization: (message: string = "Insufficient permissions", code: ErrorCode = ErrorCode.AUTH_INVALID_CREDENTIALS) =>
    new AppError(message, code, ErrorType.AUTHORIZATION, 403, true),

  notFound: (resource: string = "Resource", code: ErrorCode = ErrorCode.DB_NOT_FOUND) =>
    new AppError(`${resource} not found`, code, ErrorType.NOT_FOUND, 404, true),

  network: (message: string = "Network error occurred") =>
    new AppError(message, ErrorCode.UNKNOWN_ERROR, ErrorType.NETWORK, 0, true),

  server: (message: string = "Internal server error", context?: Record<string, any>) =>
    new AppError(message, ErrorCode.INTERNAL_ERROR, ErrorType.SERVER, 500, true, context),

  database: (message: string, code: ErrorCode = ErrorCode.DB_QUERY_ERROR, context?: Record<string, any>) =>
    new AppError(message, code, ErrorType.DATABASE, 500, true, context),

  externalApi: (message: string, code: ErrorCode = ErrorCode.API_GROK_ERROR, context?: Record<string, any>) =>
    new AppError(message, code, ErrorType.EXTERNAL_API, 502, true, context),

  fileUpload: (message: string, code: ErrorCode = ErrorCode.FILE_UPLOAD_FAILED, context?: Record<string, any>) =>
    new AppError(message, code, ErrorType.FILE_UPLOAD, 400, true, context),

  rateLimit: (message: string = "Rate limit exceeded") =>
    new AppError(message, ErrorCode.RATE_LIMIT_EXCEEDED, ErrorType.RATE_LIMIT, 429, true),
};

/**
 * Global error handler for client-side errors
 */
export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle different types of errors appropriately
   */
  public handle(error: any): void {
    console.error("Error caught by handler:", error);

    if (error instanceof AppError) {
      this.handleAppError(error);
    } else if (this.isNetworkError(error)) {
      this.handleNetworkError(error);
    } else {
      this.handleUnknownError(error);
    }
  }

  private handleAppError(error: AppError): void {
    const { message, type, context } = error;

    switch (type) {
      case ErrorType.VALIDATION:
        toast.error(`Validation Error: ${message}`);
        break;

      case ErrorType.AUTHENTICATION:
        toast.error(message);
        // Redirect to login might be handled by the auth system
        break;

      case ErrorType.AUTHORIZATION:
        toast.error(message);
        break;

      case ErrorType.NOT_FOUND:
        toast.error(message);
        break;

      case ErrorType.NETWORK:
        toast.error("Connection error. Please check your internet connection.");
        break;

      case ErrorType.SERVER:
        toast.error("Server error. Please try again later.");
        break;

      default:
        toast.error(message || "An unexpected error occurred");
    }

    // Log additional context for debugging
    if (context) {
      console.error("Error context:", context);
    }
  }

  private handleNetworkError(error: any): void {
    toast.error("Network error. Please check your connection and try again.");
  }

  private handleUnknownError(error: any): void {
    const message = error?.message || "An unexpected error occurred";
    toast.error(message);

    // Log the full error for debugging
    console.error("Unknown error:", error);
  }

  private isNetworkError(error: any): boolean {
    return (
      error?.code === "NETWORK_ERROR" ||
      error?.message?.includes("fetch") ||
      error?.message?.includes("network") ||
      !navigator.onLine
    );
  }
}

/**
 * Global error handler instance
 */
export const errorHandler = ErrorHandler.getInstance();

/**
 * React error boundary hook
 */
export function useErrorHandler() {
  return {
    handleError: (error: any) => errorHandler.handle(error),
    createError,
  };
}

/**
 * Async wrapper that automatically handles errors
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  customHandler?: (error: any) => void
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    if (customHandler) {
      customHandler(error);
    } else {
      errorHandler.handle(error);
    }
    return null;
  }
}

/**
 * API error transformer - converts API responses to AppErrors
 */
export function transformApiError(error: any): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const status = error?.status || error?.statusCode || 500;
  const message = error?.message || "API request failed";

  switch (status) {
    case 400:
      return createError.validation(message, ErrorCode.VAL_INVALID_INPUT, error?.errors);
    case 401:
      return createError.authentication(message);
    case 403:
      return createError.authorization(message);
    case 404:
      return createError.notFound(message);
    case 500:
    case 502:
    case 503:
      return createError.server(message);
    default:
      return new AppError(message, ErrorCode.UNKNOWN_ERROR, ErrorType.UNKNOWN, status);
  }
}

/**
 * Prisma error handler - converts Prisma errors to AppErrors
 */
export function handlePrismaError(error: any): AppError {
  // Handle Prisma Client Known Request Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const target = error.meta?.target as string[] | undefined;
        const field = target?.[0] || 'field';
        return createError.database(
          `A record with this ${field} already exists`,
          ErrorCode.DB_UNIQUE_CONSTRAINT,
          { prismaCode: error.code, field, meta: error.meta }
        );

      case 'P2025':
        // Record not found
        return createError.notFound(
          'Record not found',
          ErrorCode.DB_NOT_FOUND
        );

      case 'P2003':
        // Foreign key constraint violation
        const fieldName = error.meta?.field_name as string | undefined;
        return createError.database(
          `Invalid reference: ${fieldName || 'related record'} does not exist`,
          ErrorCode.DB_FOREIGN_KEY_CONSTRAINT,
          { prismaCode: error.code, field: fieldName, meta: error.meta }
        );

      case 'P2014':
        // Required relation violation
        return createError.database(
          'Cannot delete record due to required relations',
          ErrorCode.DB_FOREIGN_KEY_CONSTRAINT,
          { prismaCode: error.code, meta: error.meta }
        );

      case 'P2021':
        // Table does not exist
        return createError.database(
          'Database table does not exist. Please run migrations.',
          ErrorCode.DB_QUERY_ERROR,
          { prismaCode: error.code, meta: error.meta }
        );

      case 'P2024':
        // Connection timeout
        return createError.database(
          'Database connection timeout',
          ErrorCode.DB_CONNECTION_ERROR,
          { prismaCode: error.code }
        );

      default:
        return createError.database(
          `Database error: ${error.message}`,
          ErrorCode.DB_QUERY_ERROR,
          { prismaCode: error.code, meta: error.meta }
        );
    }
  }

  // Handle Prisma Client Validation Errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return createError.validation(
      'Invalid data provided to database',
      ErrorCode.VAL_INVALID_INPUT,
      { originalError: error.message }
    );
  }

  // Handle Prisma Client Initialization Errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return createError.database(
      'Failed to connect to database',
      ErrorCode.DB_CONNECTION_ERROR,
      { errorCode: error.errorCode }
    );
  }

  // Handle Prisma Client Rust Panic Errors
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return createError.database(
      'Critical database error occurred',
      ErrorCode.DB_QUERY_ERROR,
      { originalError: error.message }
    );
  }

  // Unknown Prisma error
  return createError.database(
    error.message || 'Unknown database error',
    ErrorCode.DB_QUERY_ERROR
  );
}

/**
 * Structured error logging with context
 */
export interface ErrorLogContext {
  userId?: string;
  endpoint?: string;
  method?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  [key: string]: any;
}

export function logError(error: AppError | Error, context?: ErrorLogContext): void {
  const isAppError = error instanceof AppError;
  
  const logData = {
    timestamp: isAppError ? error.timestamp : new Date().toISOString(),
    message: error.message,
    type: isAppError ? error.type : ErrorType.UNKNOWN,
    code: isAppError ? error.code : ErrorCode.UNKNOWN_ERROR,
    statusCode: isAppError ? error.statusCode : 500,
    stack: error.stack,
    context: {
      ...(isAppError ? error.context : {}),
      ...context,
    },
    environment: process.env.NODE_ENV,
  };

  // In development, log with formatting
  if (process.env.NODE_ENV === 'development') {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('🔴 ERROR LOGGED');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(JSON.stringify(logData, null, 2));
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } else {
    // In production, log as JSON for log aggregation services
    console.error(JSON.stringify(logData));
  }

  // TODO: Send to external error tracking service (e.g., Sentry, LogRocket)
  // if (process.env.NODE_ENV === 'production') {
  //   sendToErrorTracking(logData);
  // }
}

/**
 * Log error to database (ActivityLog)
 */
export async function logErrorToDatabase(
  error: AppError | Error,
  context?: ErrorLogContext
): Promise<void> {
  try {
    const { PrismaClient } = await import('@/app/generated/prisma');
    const prisma = new PrismaClient();

    const isAppError = error instanceof AppError;

    const errorDetails = {
      message: error.message,
      type: isAppError ? error.type : ErrorType.UNKNOWN,
      code: isAppError ? error.code : ErrorCode.UNKNOWN_ERROR,
      stack: error.stack,
      context: {
        ...(isAppError ? error.context : {}),
        ...context,
      },
    };

    await prisma.activityLog.create({
      data: {
        userId: context?.userId || null,
        action: 'ERROR',
        details: JSON.stringify(errorDetails),
        ipAddress: context?.ipAddress || null,
        userAgent: context?.userAgent || null,
      },
    });

    await prisma.$disconnect();
  } catch (dbError) {
    // Don't throw if logging fails - just log to console
    console.error('Failed to log error to database:', dbError);
  }
}
