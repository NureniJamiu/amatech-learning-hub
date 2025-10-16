/**
 * File Cleanup Utility
 * 
 * Handles cleanup of partial uploads and failed file operations
 */

import { logError, createError, ErrorCode } from './error-handler';

/**
 * Cloudinary file deletion interface
 */
interface CloudinaryDeleteOptions {
  publicId: string;
  resourceType?: 'image' | 'video' | 'raw';
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(
  options: CloudinaryDeleteOptions
): Promise<boolean> {
  try {
    const { publicId, resourceType = 'raw' } = options;

    if (!publicId) {
      console.warn('[Cleanup] No public ID provided for deletion');
      return false;
    }

    // Cloudinary deletion requires admin API credentials
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('[Cleanup] Cloudinary credentials not configured');
      return false;
    }

    // Generate signature for deletion
    const timestamp = Math.round(new Date().getTime() / 1000);
    const crypto = await import('crypto');
    
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');

    // Delete the file
    const deleteUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`;

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    const response = await fetch(deleteUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Cleanup] Failed to delete from Cloudinary:', errorData);
      return false;
    }

    const result = await response.json();
    console.log(`[Cleanup] Successfully deleted file: ${publicId}`);
    
    return result.result === 'ok';
  } catch (error: any) {
    console.error('[Cleanup] Error deleting from Cloudinary:', error);
    logError(
      createError.externalApi(
        'Failed to delete file from Cloudinary',
        ErrorCode.API_CLOUDINARY_ERROR,
        { publicId: options.publicId, error: error.message }
      )
    );
    return false;
  }
}

/**
 * Cleanup partial upload on failure
 */
export async function cleanupPartialUpload(
  fileUrl?: string,
  publicId?: string
): Promise<void> {
  if (!fileUrl && !publicId) {
    return;
  }

  try {
    // Extract public ID from URL if not provided
    let idToDelete = publicId;
    
    if (!idToDelete && fileUrl) {
      // Extract public ID from Cloudinary URL
      // Format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
      const urlParts = fileUrl.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      
      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        const fileNameWithExt = urlParts[uploadIndex + 2];
        idToDelete = fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf('.'));
      }
    }

    if (idToDelete) {
      // Determine resource type from URL or default to raw
      const resourceType = fileUrl?.includes('/image/') 
        ? 'image' 
        : fileUrl?.includes('/video/')
        ? 'video'
        : 'raw';

      await deleteFromCloudinary({
        publicId: idToDelete,
        resourceType,
      });
    }
  } catch (error: any) {
    console.error('[Cleanup] Failed to cleanup partial upload:', error);
    // Don't throw - cleanup failures shouldn't block the main error flow
  }
}

/**
 * Cleanup database record on failure
 */
export async function cleanupDatabaseRecord(
  model: 'material' | 'pastQuestion',
  recordId: string
): Promise<void> {
  try {
    const { PrismaClient } = await import('@/app/generated/prisma');
    const prisma = new PrismaClient();

    switch (model) {
      case 'material':
        await prisma.material.delete({
          where: { id: recordId },
        });
        console.log(`[Cleanup] Deleted material record: ${recordId}`);
        break;

      case 'pastQuestion':
        await prisma.pastQuestion.delete({
          where: { id: recordId },
        });
        console.log(`[Cleanup] Deleted past question record: ${recordId}`);
        break;
    }

    await prisma.$disconnect();
  } catch (error: any) {
    console.error(`[Cleanup] Failed to cleanup ${model} record:`, error);
    // Don't throw - cleanup failures shouldn't block the main error flow
  }
}

/**
 * Comprehensive cleanup for failed upload
 */
export async function cleanupFailedUpload(options: {
  fileUrl?: string;
  publicId?: string;
  model?: 'material' | 'pastQuestion';
  recordId?: string;
}): Promise<void> {
  const { fileUrl, publicId, model, recordId } = options;

  // Cleanup file from Cloudinary
  if (fileUrl || publicId) {
    await cleanupPartialUpload(fileUrl, publicId);
  }

  // Cleanup database record
  if (model && recordId) {
    await cleanupDatabaseRecord(model, recordId);
  }

  console.log('[Cleanup] Cleanup completed');
}

/**
 * Cleanup processing queue entry on failure
 */
export async function cleanupProcessingQueue(materialId: string): Promise<void> {
  try {
    const { PrismaClient } = await import('@/app/generated/prisma');
    const prisma = new PrismaClient();

    await prisma.processingQueue.delete({
      where: { materialId },
    });

    console.log(`[Cleanup] Deleted processing queue entry for material: ${materialId}`);
    await prisma.$disconnect();
  } catch (error: any) {
    console.error('[Cleanup] Failed to cleanup processing queue:', error);
    // Don't throw - cleanup failures shouldn't block the main error flow
  }
}
