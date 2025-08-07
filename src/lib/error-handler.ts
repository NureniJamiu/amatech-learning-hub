import { toast } from "react-toastify";

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
  UNKNOWN = "UNKNOWN"
}

/**
 * Enhanced error class with additional context
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);

    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, AppError);
  }
}

/**
 * Factory functions for creating specific error types
 */
export const createError = {
  validation: (message: string, context?: Record<string, any>) =>
    new AppError(message, ErrorType.VALIDATION, 400, true, context),

  authentication: (message: string = "Authentication required") =>
    new AppError(message, ErrorType.AUTHENTICATION, 401, true),

  authorization: (message: string = "Insufficient permissions") =>
    new AppError(message, ErrorType.AUTHORIZATION, 403, true),

  notFound: (resource: string = "Resource") =>
    new AppError(`${resource} not found`, ErrorType.NOT_FOUND, 404, true),

  network: (message: string = "Network error occurred") =>
    new AppError(message, ErrorType.NETWORK, 0, true),

  server: (message: string = "Internal server error", context?: Record<string, any>) =>
    new AppError(message, ErrorType.SERVER, 500, true, context),
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
      return createError.validation(message, error?.errors);
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
      return new AppError(message, ErrorType.UNKNOWN, status);
  }
}
