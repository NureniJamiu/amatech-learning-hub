/**
 * File Validation Utility
 * 
 * Provides comprehensive file validation for uploads including:
 * - File type validation
 * - File size validation
 * - Security checks
 */

import { createError, ErrorCode } from './error-handler';

/**
 * Allowed file types and their configurations
 */
export const FILE_CONFIGS = {
  pdf: {
    mimeTypes: ['application/pdf'] as string[],
    extensions: ['.pdf'] as string[],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: 'PDF document',
  },
  image: {
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ] as string[],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'] as string[],
    maxSize: 5 * 1024 * 1024, // 5MB
    description: 'Image file',
  },
  video: {
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'] as string[],
    extensions: ['.mp4', '.webm', '.mov'] as string[],
    maxSize: 50 * 1024 * 1024, // 50MB
    description: 'Video file',
  },
};

export type FileType = keyof typeof FILE_CONFIGS;

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: ErrorCode;
}

/**
 * Validate file type based on MIME type and extension
 */
export function validateFileType(
  file: File,
  allowedTypes: FileType[]
): ValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'No file provided',
      errorCode: ErrorCode.VAL_MISSING_FIELD,
    };
  }

  // Get file extension
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

  // Check against allowed types
  for (const type of allowedTypes) {
    const config = FILE_CONFIGS[type];

    // Check MIME type
    if (config.mimeTypes.includes(file.type)) {
      // Also verify extension matches
      if (config.extensions.includes(fileExtension)) {
        return { valid: true };
      }
    }
  }

  const allowedExtensions = allowedTypes
    .flatMap((type) => FILE_CONFIGS[type].extensions)
    .join(', ');

  return {
    valid: false,
    error: `Invalid file type. Allowed types: ${allowedExtensions}`,
    errorCode: ErrorCode.VAL_INVALID_FILE_TYPE,
  };
}

/**
 * Validate file size
 */
export function validateFileSize(
  file: File,
  fileType: FileType
): ValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'No file provided',
      errorCode: ErrorCode.VAL_MISSING_FIELD,
    };
  }

  const config = FILE_CONFIGS[fileType];
  const maxSize = config.maxSize;

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

    return {
      valid: false,
      error: `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
      errorCode: ErrorCode.VAL_FILE_TOO_LARGE,
    };
  }

  return { valid: true };
}

/**
 * Validate file name for security issues
 */
export function validateFileName(file: File): ValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'No file provided',
      errorCode: ErrorCode.VAL_MISSING_FIELD,
    };
  }

  const fileName = file.name;

  // Check for path traversal attempts
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return {
      valid: false,
      error: 'Invalid file name: path traversal detected',
      errorCode: ErrorCode.VAL_INVALID_FORMAT,
    };
  }

  // Check for null bytes
  if (fileName.includes('\0')) {
    return {
      valid: false,
      error: 'Invalid file name: null byte detected',
      errorCode: ErrorCode.VAL_INVALID_FORMAT,
    };
  }

  // Check for excessively long file names
  if (fileName.length > 255) {
    return {
      valid: false,
      error: 'File name is too long (max 255 characters)',
      errorCode: ErrorCode.VAL_INVALID_FORMAT,
    };
  }

  // Check for empty file name
  if (!fileName.trim()) {
    return {
      valid: false,
      error: 'File name cannot be empty',
      errorCode: ErrorCode.VAL_MISSING_FIELD,
    };
  }

  return { valid: true };
}

/**
 * Comprehensive file validation
 */
export function validateFile(
  file: File,
  allowedTypes: FileType[]
): ValidationResult {
  // Validate file name
  const nameValidation = validateFileName(file);
  if (!nameValidation.valid) {
    return nameValidation;
  }

  // Validate file security (malicious patterns, double extensions, etc.)
  const securityValidation = validateFileSecurity(file);
  if (!securityValidation.valid) {
    return securityValidation;
  }

  // Validate file type
  const typeValidation = validateFileType(file, allowedTypes);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  // Determine the specific file type for size validation
  const fileType = allowedTypes.find((type) => {
    const config = FILE_CONFIGS[type];
    return config.mimeTypes.includes(file.type);
  });

  if (!fileType) {
    return {
      valid: false,
      error: 'Unable to determine file type',
      errorCode: ErrorCode.VAL_INVALID_FILE_TYPE,
    };
  }

  // Validate file size
  const sizeValidation = validateFileSize(file, fileType);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  return { valid: true };
}

/**
 * Validate file and throw error if invalid
 */
export function validateFileOrThrow(
  file: File,
  allowedTypes: FileType[]
): void {
  const result = validateFile(file, allowedTypes);

  if (!result.valid) {
    throw createError.fileUpload(
      result.error || 'File validation failed',
      result.errorCode || ErrorCode.FILE_UPLOAD_FAILED
    );
  }
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if file is empty
 */
export function isFileEmpty(file: File): boolean {
  return file.size === 0;
}

/**
 * Sanitize file name for safe storage
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path components
  let sanitized = fileName.replace(/^.*[\\\/]/, '');

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

  return sanitized || 'unnamed_file';
}

/**
 * Validate file content type matches extension
 */
export function validateFileContentType(file: File): ValidationResult {
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  const mimeType = file.type;

  // Map of extensions to expected MIME types
  const extensionMimeMap: Record<string, string[]> = {
    '.pdf': ['application/pdf'],
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.png': ['image/png'],
    '.gif': ['image/gif'],
    '.webp': ['image/webp'],
    '.svg': ['image/svg+xml'],
    '.mp4': ['video/mp4'],
    '.webm': ['video/webm'],
    '.mov': ['video/quicktime'],
  };

  const expectedMimeTypes = extensionMimeMap[fileExtension];

  if (!expectedMimeTypes) {
    return {
      valid: false,
      error: 'Unsupported file extension',
      errorCode: ErrorCode.VAL_INVALID_FILE_TYPE,
    };
  }

  if (!expectedMimeTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `File content type (${mimeType}) does not match extension (${fileExtension})`,
      errorCode: ErrorCode.VAL_INVALID_FILE_TYPE,
    };
  }

  return { valid: true };
}

/**
 * Check for potentially malicious file names
 */
export function validateFileNameSecurity(file: File): ValidationResult {
  const fileName = file.name;

  // Check for executable extensions (even if disguised)
  const dangerousExtensions = [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr',
    '.vbs', '.js', '.jar', '.msi', '.app', '.deb',
    '.rpm', '.sh', '.ps1', '.psm1',
  ];

  const lowerFileName = fileName.toLowerCase();
  for (const ext of dangerousExtensions) {
    if (lowerFileName.includes(ext)) {
      return {
        valid: false,
        error: 'Executable files are not allowed',
        errorCode: ErrorCode.VAL_INVALID_FILE_TYPE,
      };
    }
  }

  // Check for double extensions (e.g., file.pdf.exe)
  const extensionCount = (fileName.match(/\./g) || []).length;
  if (extensionCount > 1) {
    const parts = fileName.split('.');
    const lastExt = '.' + parts[parts.length - 1].toLowerCase();
    const secondLastExt = '.' + parts[parts.length - 2].toLowerCase();

    // Allow common double extensions like .tar.gz
    const allowedDoubleExtensions = ['.tar.gz', '.tar.bz2'];
    const doubleExt = secondLastExt + lastExt;

    if (!allowedDoubleExtensions.includes(doubleExt)) {
      // Check if second-to-last is a dangerous extension
      if (dangerousExtensions.includes(secondLastExt)) {
        return {
          valid: false,
          error: 'Files with multiple extensions are not allowed',
          errorCode: ErrorCode.VAL_INVALID_FILE_TYPE,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Comprehensive security validation for files
 */
export function validateFileSecurity(file: File): ValidationResult {
  // Check file name security
  const nameSecurityResult = validateFileNameSecurity(file);
  if (!nameSecurityResult.valid) {
    return nameSecurityResult;
  }

  // Check content type matches extension
  const contentTypeResult = validateFileContentType(file);
  if (!contentTypeResult.valid) {
    return contentTypeResult;
  }

  return { valid: true };
}
