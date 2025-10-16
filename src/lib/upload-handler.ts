/**
 * Upload Handler Utility
 * 
 * Provides a comprehensive wrapper for file uploads with:
 * - File validation
 * - Error handling
 * - Automatic cleanup on failure
 */

import { validateFileOrThrow, FileType } from './file-validation';
import { uploadToCloudinary, CloudinaryError } from './cloudinary';
import { cleanupFailedUpload } from './file-cleanup';
import { createError, ErrorCode, logError, handlePrismaError } from './error-handler';

/**
 * Upload options
 */
export interface UploadOptions {
  file: File;
  allowedTypes: FileType[];
  uploadPreset: string;
  folder?: string;
  tags?: string[];
  publicId?: string;
}

/**
 * Upload result
 */
export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  publicId?: string;
  error?: string;
  errorCode?: ErrorCode;
}

/**
 * Safe file upload with validation and error handling
 */
export async function safeFileUpload(
  options: UploadOptions
): Promise<UploadResult> {
  const { file, allowedTypes, uploadPreset, folder, tags, publicId } = options;

  try {
    // Step 1: Validate file
    console.log(`[Upload] Validating file: ${file.name}`);
    validateFileOrThrow(file, allowedTypes);

    // Step 2: Upload to Cloudinary
    console.log(`[Upload] Uploading file to Cloudinary: ${file.name}`);
    const response = await uploadToCloudinary(file, {
      uploadPreset,
      folder,
      tags,
      publicId,
    });

    console.log(`[Upload] Successfully uploaded: ${file.name}`);
    
    return {
      success: true,
      fileUrl: response.secureUrl,
      publicId: response.publicId,
    };
  } catch (error: any) {
    console.error(`[Upload] Failed to upload file: ${file.name}`, error);

    // Determine error code and message
    let errorCode = ErrorCode.FILE_UPLOAD_FAILED;
    let errorMessage = 'File upload failed';

    if (error.code) {
      errorCode = error.code;
      errorMessage = error.message;
    } else if (error instanceof CloudinaryError) {
      errorCode = ErrorCode.API_CLOUDINARY_ERROR;
      errorMessage = error.message;
    }

    // Log the error
    logError(
      createError.fileUpload(errorMessage, errorCode, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })
    );

    return {
      success: false,
      error: errorMessage,
      errorCode,
    };
  }
}

/**
 * Upload with database record creation and automatic cleanup
 */
export async function uploadWithDatabaseRecord<T>(
  uploadOptions: UploadOptions,
  createRecord: (fileUrl: string) => Promise<T>,
  model: 'material' | 'pastQuestion'
): Promise<{ success: boolean; data?: T; error?: string }> {
  let uploadResult: UploadResult | null = null;
  let recordId: string | null = null;

  try {
    // Step 1: Upload file
    uploadResult = await safeFileUpload(uploadOptions);

    if (!uploadResult.success || !uploadResult.fileUrl) {
      return {
        success: false,
        error: uploadResult.error || 'File upload failed',
      };
    }

    // Step 2: Create database record
    console.log(`[Upload] Creating ${model} record`);
    const record = await createRecord(uploadResult.fileUrl);
    
    // Extract record ID for cleanup if needed
    if (record && typeof record === 'object' && 'id' in record) {
      recordId = (record as any).id;
    }

    console.log(`[Upload] Successfully created ${model} record`);

    return {
      success: true,
      data: record,
    };
  } catch (error: any) {
    console.error(`[Upload] Failed to create ${model} record:`, error);

    // Handle Prisma errors
    const appError = handlePrismaError(error);
    logError(appError);

    // Cleanup uploaded file if database record creation failed
    if (uploadResult?.fileUrl || uploadResult?.publicId) {
      console.log(`[Upload] Cleaning up uploaded file due to database error`);
      await cleanupFailedUpload({
        fileUrl: uploadResult.fileUrl,
        publicId: uploadResult.publicId,
      });
    }

    return {
      success: false,
      error: appError.message,
    };
  }
}

/**
 * Example usage for material upload
 */
export async function uploadMaterial(
  file: File,
  title: string,
  courseId: string,
  uploadedById: string
): Promise<{ success: boolean; material?: any; error?: string }> {
  const { PrismaClient } = await import('@/app/generated/prisma');
  const prisma = new PrismaClient();

  try {
    const result = await uploadWithDatabaseRecord(
      {
        file,
        allowedTypes: ['pdf'],
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'materials',
        folder: 'materials',
        tags: ['material', courseId],
      },
      async (fileUrl: string) => {
        return await prisma.material.create({
          data: {
            title,
            fileUrl,
            courseId,
            uploadedById,
            processingStatus: 'pending',
          },
          include: {
            course: {
              select: {
                code: true,
                title: true,
              },
            },
            uploadedBy: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        });
      },
      'material'
    );

    await prisma.$disconnect();
    return result;
  } catch (error: any) {
    await prisma.$disconnect();
    throw error;
  }
}

/**
 * Example usage for past question upload
 */
export async function uploadPastQuestion(
  file: File,
  title: string,
  year: number,
  courseId: string,
  uploadedById: string
): Promise<{ success: boolean; pastQuestion?: any; error?: string }> {
  const { PrismaClient } = await import('@/app/generated/prisma');
  const prisma = new PrismaClient();

  try {
    const result = await uploadWithDatabaseRecord(
      {
        file,
        allowedTypes: ['pdf'],
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'past_questions',
        folder: 'past_questions',
        tags: ['past_question', courseId, year.toString()],
      },
      async (fileUrl: string) => {
        return await prisma.pastQuestion.create({
          data: {
            title,
            year,
            fileUrl,
            courseId,
            uploadedById,
          },
          include: {
            course: {
              select: {
                code: true,
                title: true,
              },
            },
            uploadedBy: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        });
      },
      'pastQuestion'
    );

    await prisma.$disconnect();
    return result;
  } catch (error: any) {
    await prisma.$disconnect();
    throw error;
  }
}
