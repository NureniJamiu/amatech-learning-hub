/**
 * Authentication Error Handler
 * Provides consistent error handling for authentication-related issues
 */

export enum AuthErrorType {
    MISSING_TOKEN = "MISSING_TOKEN",
    MALFORMED_TOKEN = "MALFORMED_TOKEN",
    EXPIRED_TOKEN = "EXPIRED_TOKEN",
    INVALID_TOKEN = "INVALID_TOKEN",
    INVALID_SIGNATURE = "INVALID_SIGNATURE",
    FORBIDDEN = "FORBIDDEN",
    SESSION_NOT_FOUND = "SESSION_NOT_FOUND",
    SESSION_EXPIRED = "SESSION_EXPIRED",
}

export interface AuthError {
    type: AuthErrorType;
    message: string;
    statusCode: number;
    timestamp: string;
    details?: Record<string, any>;
}

export class AuthErrorHandler {
    /**
     * Create a standardized auth error
     */
    static createError(
        type: AuthErrorType,
        message?: string,
        details?: Record<string, any>
    ): AuthError {
        const defaultMessages: Record<AuthErrorType, string> = {
            [AuthErrorType.MISSING_TOKEN]: "Authentication required. Please provide a valid token.",
            [AuthErrorType.MALFORMED_TOKEN]: "Malformed token. Token must be a valid JWT.",
            [AuthErrorType.EXPIRED_TOKEN]: "Token has expired. Please log in again.",
            [AuthErrorType.INVALID_TOKEN]: "Invalid token. Please log in again.",
            [AuthErrorType.INVALID_SIGNATURE]: "Token signature verification failed.",
            [AuthErrorType.FORBIDDEN]: "You do not have permission to access this resource.",
            [AuthErrorType.SESSION_NOT_FOUND]: "Session not found. Please log in again.",
            [AuthErrorType.SESSION_EXPIRED]: "Session has expired. Please log in again.",
        };

        const statusCodes: Record<AuthErrorType, number> = {
            [AuthErrorType.MISSING_TOKEN]: 401,
            [AuthErrorType.MALFORMED_TOKEN]: 401,
            [AuthErrorType.EXPIRED_TOKEN]: 401,
            [AuthErrorType.INVALID_TOKEN]: 401,
            [AuthErrorType.INVALID_SIGNATURE]: 401,
            [AuthErrorType.FORBIDDEN]: 403,
            [AuthErrorType.SESSION_NOT_FOUND]: 401,
            [AuthErrorType.SESSION_EXPIRED]: 401,
        };

        return {
            type,
            message: message || defaultMessages[type],
            statusCode: statusCodes[type],
            timestamp: new Date().toISOString(),
            details,
        };
    }

    /**
     * Log authentication error with context
     */
    static logError(error: AuthError, context?: Record<string, any>): void {
        const logData = {
            ...error,
            context,
            environment: process.env.NODE_ENV,
        };

        if (process.env.NODE_ENV === "development") {
            console.error("[Auth Error]", JSON.stringify(logData, null, 2));
        } else {
            // In production, log to your error tracking service
            console.error("[Auth Error]", JSON.stringify(logData));
        }
    }

    /**
     * Check if error is a token expiration issue
     */
    static isTokenExpired(error: AuthError): boolean {
        return error.type === AuthErrorType.EXPIRED_TOKEN;
    }

    /**
     * Check if error requires re-authentication
     */
    static requiresReauth(error: AuthError): boolean {
        return [
            AuthErrorType.MISSING_TOKEN,
            AuthErrorType.EXPIRED_TOKEN,
            AuthErrorType.INVALID_TOKEN,
            AuthErrorType.SESSION_NOT_FOUND,
            AuthErrorType.SESSION_EXPIRED,
        ].includes(error.type);
    }
}
