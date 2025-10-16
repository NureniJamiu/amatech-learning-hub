/**
 * Cloudinary Upload Utility
 *
 * A versatile function to upload different types of media (images, PDFs, videos) to Cloudinary
 * and return the URL for storage in the database.
 */

// Define allowed resource types and their MIME types
const ALLOWED_RESOURCE_TYPES = {
    image: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
    ],
    pdf: ["application/pdf"],
    video: ["video/mp4", "video/webm", "video/quicktime"],
};

type ResourceType = "image" | "pdf" | "video" | "auto";

interface CloudinaryUploadOptions {
    /** Cloudinary upload preset to use (required) */
    uploadPreset: string;

    /** Resource type - helps with organizing files in Cloudinary */
    resourceType?: ResourceType;

    /** Public ID for the upload (optional) */
    publicId?: string;

    /** Tags to apply to the uploaded file */
    tags?: string[];

    /** Folder to store the file in */
    folder?: string;

    /** Transformation to apply during upload */
    transformation?: Record<string, any>;
}

interface CloudinaryResponse {
    /** The URL of the uploaded file */
    url: string;

    /** The secure HTTPS URL of the uploaded file */
    secureUrl: string;

    /** The public ID of the uploaded file */
    publicId: string;

    /** File format */
    format: string;

    /** File width (for images and videos) */
    width?: number;

    /** File height (for images and videos) */
    height?: number;

    /** Resource type (image, video, raw) */
    resourceType: string;

    /** Any error that occurred during upload */
    error?: string;
}

/**
 * Detects the resource type based on the file object
 */
function detectResourceType(file: File): ResourceType {
    if (ALLOWED_RESOURCE_TYPES.image.includes(file.type)) {
        return "image";
    } else if (ALLOWED_RESOURCE_TYPES.pdf.includes(file.type)) {
        return "pdf";
    } else if (ALLOWED_RESOURCE_TYPES.video.includes(file.type)) {
        return "video";
    }

    // Default to auto if unable to determine
    return "auto";
}

/**
 * Custom error classes for Cloudinary
 */
export class CloudinaryError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public response?: any
    ) {
        super(message);
        this.name = "CloudinaryError";
    }
}

export class CloudinaryTimeoutError extends CloudinaryError {
    constructor(message: string) {
        super(message, 408);
        this.name = "CloudinaryTimeoutError";
    }
}

export class CloudinaryRateLimitError extends CloudinaryError {
    constructor(message: string, public retryAfter?: number) {
        super(message, 429);
        this.name = "CloudinaryRateLimitError";
    }
}

/**
 * Retry configuration for Cloudinary uploads
 */
interface RetryConfig {
    maxRetries: number;
    retryDelay: number;
    timeout: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    timeout: 60000, // 60 seconds
};

/**
 * Retry logic with exponential backoff for Cloudinary
 */
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    config: RetryConfig = DEFAULT_RETRY_CONFIG,
    attempt: number = 0
): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        // Don't retry on certain errors
        if (
            error instanceof CloudinaryTimeoutError ||
            error instanceof CloudinaryRateLimitError ||
            (error instanceof CloudinaryError && error.statusCode && error.statusCode < 500)
        ) {
            console.error(`[Cloudinary] Non-retryable error: ${error.message}`);
            throw error;
        }

        // Check if we should retry
        if (attempt >= config.maxRetries) {
            console.error(`[Cloudinary] Max retries (${config.maxRetries}) exceeded`);
            throw error;
        }

        // Calculate delay with exponential backoff (with jitter)
        const baseDelay = config.retryDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 1000; // Add up to 1 second of jitter
        const delay = baseDelay + jitter;

        console.warn(`[Cloudinary] Request failed: ${error.message}`);
        console.warn(`[Cloudinary] Retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${config.maxRetries})`);

        await new Promise((resolve) => setTimeout(resolve, delay));

        return retryWithBackoff(fn, config, attempt + 1);
    }
}

/**
 * Uploads a file to Cloudinary and returns the response
 * @param file The file to upload
 * @param options Upload options including preset, resource type, etc.
 * @returns Promise with the Cloudinary response containing URLs and metadata
 */
export async function uploadToCloudinary(
    file: File,
    options: CloudinaryUploadOptions
): Promise<CloudinaryResponse> {
    if (!file) {
        throw new CloudinaryError("No file provided for upload", 400);
    }

    if (!options.uploadPreset) {
        throw new CloudinaryError("Upload preset is required", 400);
    }

    // Determine resource type if not specified
    const resourceType = options.resourceType || detectResourceType(file);

    // Convert resourceType to Cloudinary's expected format
    // Cloudinary uses "raw" for PDFs and other documents
    const cloudinaryResourceType =
        resourceType === "pdf" ? "raw" : resourceType;

    // Create form data for the upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", options.uploadPreset);

    // Add optional parameters
    if (options.publicId) formData.append("public_id", options.publicId);
    if (options.tags && options.tags.length > 0) {
        formData.append("tags", options.tags.join(","));
    }
    if (options.folder) formData.append("folder", options.folder);

    // Add any transformations
    if (options.transformation) {
        formData.append(
            "transformation",
            JSON.stringify(options.transformation)
        );
    }

    // Get the Cloudinary upload URL for the specified resource type
    const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${cloudinaryResourceType}/upload`;

    return retryWithBackoff(async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                DEFAULT_RETRY_CONFIG.timeout
            );

            const response = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle rate limiting
            if (response.status === 429) {
                const retryAfter = parseInt(
                    response.headers.get("retry-after") || "60",
                    10
                );
                throw new CloudinaryRateLimitError(
                    "Cloudinary rate limit exceeded",
                    retryAfter
                );
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new CloudinaryError(
                    errorData.error?.message || `Upload failed: ${response.statusText}`,
                    response.status,
                    errorData
                );
            }

            const data = await response.json();

            console.log(`[Cloudinary] Successfully uploaded ${file.name}`);

            return {
                url: data.url,
                secureUrl: data.secure_url,
                publicId: data.public_id,
                format: data.format,
                width: data.width,
                height: data.height,
                resourceType: data.resource_type,
            };
        } catch (error: any) {
            if (error.name === "AbortError") {
                throw new CloudinaryTimeoutError("Cloudinary upload timed out");
            }
            throw error;
        }
    });
}

/**
 * Helper function specifically for uploading images
 */
export async function uploadImage(
    file: File,
    uploadPreset: string,
    options: Omit<CloudinaryUploadOptions, "uploadPreset" | "resourceType"> = {}
): Promise<string> {
    try {
        const response = await uploadToCloudinary(file, {
            uploadPreset,
            resourceType: "image",
            ...options,
        });

        return response.secureUrl;
    } catch (error: any) {
        console.error("[Cloudinary] Image upload failed:", error);
        throw new CloudinaryError(
            `Image upload failed: ${error.message}`,
            error.statusCode
        );
    }
}

/**
 * Helper function specifically for uploading PDF documents
 */
export async function uploadPdf(
    file: File,
    uploadPreset: string,
    options: Omit<CloudinaryUploadOptions, "uploadPreset" | "resourceType"> = {}
): Promise<string> {
    try {
        const response = await uploadToCloudinary(file, {
            uploadPreset,
            resourceType: "pdf",
            ...options,
        });

        return response.secureUrl;
    } catch (error: any) {
        console.error("[Cloudinary] PDF upload failed:", error);
        throw new CloudinaryError(
            `PDF upload failed: ${error.message}`,
            error.statusCode
        );
    }
}

/**
 * Helper function specifically for uploading video files
 */
export async function uploadVideo(
    file: File,
    uploadPreset: string,
    options: Omit<CloudinaryUploadOptions, "uploadPreset" | "resourceType"> = {}
): Promise<string> {
    try {
        const response = await uploadToCloudinary(file, {
            uploadPreset,
            resourceType: "video",
            ...options,
        });

        return response.secureUrl;
    } catch (error: any) {
        console.error("[Cloudinary] Video upload failed:", error);
        throw new CloudinaryError(
            `Video upload failed: ${error.message}`,
            error.statusCode
        );
    }
}
