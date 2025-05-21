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
        throw new Error("No file provided for upload");
    }

    if (!options.uploadPreset) {
        throw new Error("Upload preset is required");
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

    try {
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();

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
        console.error("Cloudinary upload error:", error);
        return {
            url: "",
            secureUrl: "",
            publicId: "",
            format: "",
            resourceType: "",
            error: error.message || "Upload failed",
        };
    }
}

/**
 * Helper function specifically for uploading images
 */
export async function uploadImage(
    file: File,
    uploadPreset: string,
    options: Omit<CloudinaryUploadOptions, "uploadPreset" | "resourceType"> = {}
): Promise<string> {
    const response = await uploadToCloudinary(file, {
        uploadPreset,
        resourceType: "image",
        ...options,
    });

    if (response.error) {
        throw new Error(`Image upload failed: ${response.error}`);
    }

    return response.secureUrl;
}

/**
 * Helper function specifically for uploading PDF documents
 */
export async function uploadPdf(
    file: File,
    uploadPreset: string,
    options: Omit<CloudinaryUploadOptions, "uploadPreset" | "resourceType"> = {}
): Promise<string> {
    const response = await uploadToCloudinary(file, {
        uploadPreset,
        resourceType: "pdf",
        ...options,
    });

    if (response.error) {
        throw new Error(`PDF upload failed: ${response.error}`);
    }

    return response.secureUrl;
}

/**
 * Helper function specifically for uploading video files
 */
export async function uploadVideo(
    file: File,
    uploadPreset: string,
    options: Omit<CloudinaryUploadOptions, "uploadPreset" | "resourceType"> = {}
): Promise<string> {
    const response = await uploadToCloudinary(file, {
        uploadPreset,
        resourceType: "video",
        ...options,
    });

    if (response.error) {
        throw new Error(`Video upload failed: ${response.error}`);
    }

    return response.secureUrl;
}
