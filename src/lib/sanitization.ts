/**
 * Sanitization Utilities
 * 
 * Provides functions to sanitize user input and prevent security vulnerabilities:
 * - XSS (Cross-Site Scripting) prevention
 * - Path traversal prevention
 * - SQL injection prevention (via Prisma parameterization)
 * - HTML/Script injection prevention
 */

import { createError, ErrorCode } from './error-handler';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes potentially dangerous HTML tags and attributes
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Remove object and embed tags
  sanitized = sanitized.replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '');

  // Remove style tags (can contain expressions)
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  return sanitized.trim();
}

/**
 * Sanitize plain text input
 * Escapes HTML special characters
 */
export function sanitizeText(input: string): string {
  if (!input) return '';

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Sanitize file path to prevent path traversal attacks
 */
export function sanitizeFilePath(filePath: string): string {
  if (!filePath) {
    throw createError.validation('File path cannot be empty', ErrorCode.VAL_MISSING_FIELD);
  }

  // Remove any path traversal attempts
  let sanitized = filePath.replace(/\.\./g, '');

  // Remove leading slashes
  sanitized = sanitized.replace(/^[\/\\]+/, '');

  // Replace backslashes with forward slashes
  sanitized = sanitized.replace(/\\/g, '/');

  // Remove multiple consecutive slashes
  sanitized = sanitized.replace(/\/+/g, '/');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Validate that the path doesn't try to escape
  if (sanitized.includes('..') || sanitized.startsWith('/')) {
    throw createError.validation(
      'Invalid file path: path traversal detected',
      ErrorCode.VAL_INVALID_FORMAT
    );
  }

  return sanitized;
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) {
    throw createError.validation('URL cannot be empty', ErrorCode.VAL_MISSING_FIELD);
  }

  // Remove whitespace
  let sanitized = url.trim();

  // Check for javascript: protocol
  if (sanitized.toLowerCase().startsWith('javascript:')) {
    throw createError.validation(
      'Invalid URL: javascript protocol not allowed',
      ErrorCode.VAL_INVALID_FORMAT
    );
  }

  // Check for data: protocol
  if (sanitized.toLowerCase().startsWith('data:')) {
    throw createError.validation(
      'Invalid URL: data protocol not allowed',
      ErrorCode.VAL_INVALID_FORMAT
    );
  }

  // Check for file: protocol
  if (sanitized.toLowerCase().startsWith('file:')) {
    throw createError.validation(
      'Invalid URL: file protocol not allowed',
      ErrorCode.VAL_INVALID_FORMAT
    );
  }

  // Ensure URL starts with http:// or https://
  if (!sanitized.match(/^https?:\/\//i)) {
    throw createError.validation(
      'Invalid URL: must start with http:// or https://',
      ErrorCode.VAL_INVALID_FORMAT
    );
  }

  return sanitized;
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email) {
    throw createError.validation('Email cannot be empty', ErrorCode.VAL_MISSING_FIELD);
  }

  // Convert to lowercase and trim
  let sanitized = email.toLowerCase().trim();

  // Remove any HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    throw createError.validation('Invalid email format', ErrorCode.VAL_INVALID_FORMAT);
  }

  return sanitized;
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) {
    throw createError.validation('File name cannot be empty', ErrorCode.VAL_MISSING_FIELD);
  }

  // Remove path components
  let sanitized = fileName.replace(/^.*[\\\/]/, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Check for path traversal
  if (sanitized.includes('..') || sanitized.includes('/') || sanitized.includes('\\')) {
    throw createError.validation(
      'Invalid file name: path traversal detected',
      ErrorCode.VAL_INVALID_FORMAT
    );
  }

  // Replace spaces with underscores
  sanitized = sanitized.replace(/\s+/g, '_');

  // Remove special characters except dots, dashes, and underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '');

  // Remove multiple consecutive dots
  sanitized = sanitized.replace(/\.{2,}/g, '.');

  // Ensure it doesn't start with a dot
  sanitized = sanitized.replace(/^\.+/, '');

  // Truncate if too long (keep extension)
  if (sanitized.length > 255) {
    const extension = sanitized.substring(sanitized.lastIndexOf('.'));
    const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'));
    sanitized = nameWithoutExt.substring(0, 255 - extension.length) + extension;
  }

  if (!sanitized) {
    return 'unnamed_file';
  }

  return sanitized;
}

/**
 * Sanitize SQL-like input (though Prisma handles this, extra layer of security)
 */
export function sanitizeSqlInput(input: string): string {
  if (!input) return '';

  // Remove SQL comment markers
  let sanitized = input.replace(/--/g, '');
  sanitized = sanitized.replace(/\/\*/g, '');
  sanitized = sanitized.replace(/\*\//g, '');

  // Remove semicolons (statement terminators)
  sanitized = sanitized.replace(/;/g, '');

  return sanitized.trim();
}

/**
 * Sanitize JSON input
 */
export function sanitizeJson(input: string): string {
  if (!input) return '';

  try {
    // Parse and re-stringify to ensure valid JSON
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (error) {
    throw createError.validation('Invalid JSON format', ErrorCode.VAL_INVALID_FORMAT);
  }
}

/**
 * Sanitize user input for search queries
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';

  // Remove HTML tags
  let sanitized = query.replace(/<[^>]*>/g, '');

  // Remove special regex characters that could cause issues
  sanitized = sanitized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Limit length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  return sanitized.trim();
}

/**
 * Validate and sanitize matric number
 */
export function sanitizeMatricNumber(matricNumber: string): string {
  if (!matricNumber) {
    throw createError.validation('Matric number cannot be empty', ErrorCode.VAL_MISSING_FIELD);
  }

  // Convert to uppercase and trim
  let sanitized = matricNumber.toUpperCase().trim();

  // Remove any non-alphanumeric characters except forward slash
  sanitized = sanitized.replace(/[^A-Z0-9\/]/g, '');

  // Validate format (basic check)
  if (sanitized.length < 5 || sanitized.length > 20) {
    throw createError.validation(
      'Invalid matric number format',
      ErrorCode.VAL_INVALID_FORMAT
    );
  }

  return sanitized;
}

/**
 * Sanitize phone number
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) {
    throw createError.validation('Phone number cannot be empty', ErrorCode.VAL_MISSING_FIELD);
  }

  // Remove all non-numeric characters except + at the start
  let sanitized = phone.trim();
  const hasPlus = sanitized.startsWith('+');

  sanitized = sanitized.replace(/[^0-9]/g, '');

  if (hasPlus) {
    sanitized = '+' + sanitized;
  }

  // Validate length
  if (sanitized.replace('+', '').length < 10 || sanitized.replace('+', '').length > 15) {
    throw createError.validation(
      'Invalid phone number length',
      ErrorCode.VAL_INVALID_FORMAT
    );
  }

  return sanitized;
}

/**
 * Sanitize course code
 */
export function sanitizeCourseCode(code: string): string {
  if (!code) {
    throw createError.validation('Course code cannot be empty', ErrorCode.VAL_MISSING_FIELD);
  }

  // Convert to uppercase and trim
  let sanitized = code.toUpperCase().trim();

  // Remove any non-alphanumeric characters except spaces
  sanitized = sanitized.replace(/[^A-Z0-9\s]/g, '');

  // Remove multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ');

  return sanitized;
}

/**
 * Sanitize generic text input (for titles, descriptions, etc.)
 */
export function sanitizeInput(input: string, maxLength?: number): string {
  if (!input) return '';

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ');

  // Truncate if needed
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Deep sanitize an object (recursively sanitize all string values)
 */
export function deepSanitize<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = deepSanitize(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Check if string contains potential XSS patterns
 */
export function containsXss(input: string): boolean {
  if (!input) return false;

  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Check if string contains path traversal patterns
 */
export function containsPathTraversal(input: string): boolean {
  if (!input) return false;

  const pathTraversalPatterns = [
    /\.\./,
    /\.\.\//, 
    /\.\.\\/, 
    /%2e%2e/i,
    /%252e%252e/i,
  ];

  return pathTraversalPatterns.some((pattern) => pattern.test(input));
}

/**
 * Validate that input doesn't contain dangerous patterns
 */
export function validateSafety(input: string, fieldName: string = 'Input'): void {
  if (containsXss(input)) {
    throw createError.validation(
      `${fieldName} contains potentially dangerous content`,
      ErrorCode.VAL_INVALID_FORMAT
    );
  }

  if (containsPathTraversal(input)) {
    throw createError.validation(
      `${fieldName} contains path traversal patterns`,
      ErrorCode.VAL_INVALID_FORMAT
    );
  }
}
