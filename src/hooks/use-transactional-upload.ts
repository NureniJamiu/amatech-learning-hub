"use client";

import { useState } from "react";
import useFileUpload from "./useFileUpload";

interface TransactionalUploadOptions {
    uploadPreset: string;
    folder?: string;
    onSuccess?: (url: string) => void;
    onError?: (error: Error) => void;
}

interface TransactionalUploadReturn {
    selectedFile: File | null;
    uploadedUrl: string | null;
    isUploading: boolean;
    error: string | null;
    progress: number;
    setSelectedFile: (file: File | null) => void;
    executeUpload: () => Promise<string | null>;
    cleanupUpload: (fileUrl: string) => Promise<void>;
    reset: () => void;
    canProceed: boolean;
}

/**
 * Hook for transactional file uploads
 * Separates file selection from actual upload to ensure atomicity
 */
export function useTransactionalUpload(options: TransactionalUploadOptions): TransactionalUploadReturn {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const { uploadFile, status, error, progress, reset: resetUpload } = useFileUpload({
        defaultUploadPreset: options.uploadPreset,
        defaultFolder: options.folder,
        onSuccess: (url) => {
            setUploadedUrl(url);
            options.onSuccess?.(url);
        },
        onError: (error) => {
            options.onError?.(error);
        },
    });

    const executeUpload = async (): Promise<string | null> => {
        if (!selectedFile) {
            throw new Error("No file selected for upload");
        }

        try {
            const url = await uploadFile(
                selectedFile,
                options.uploadPreset,
                options.folder ? { folder: options.folder } : {}
            );
            return url;
        } catch (err) {
            console.error("Upload failed:", err);
            throw err;
        }
    };

    const cleanupUpload = async (fileUrl: string): Promise<void> => {
        try {
            const response = await fetch("/api/v1/cloudinary/cleanup-file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileUrl }),
            });

            if (!response.ok) {
                throw new Error("Cleanup request failed");
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || "Cleanup failed");
            }
        } catch (err) {
            console.error("File cleanup failed:", err);
            // Don't throw here as this is a cleanup operation
        }
    };

    const reset = () => {
        setSelectedFile(null);
        setUploadedUrl(null);
        resetUpload();
    };

    const canProceed = selectedFile !== null;

    return {
        selectedFile,
        uploadedUrl,
        isUploading: status === "uploading",
        error,
        progress,
        setSelectedFile,
        executeUpload,
        cleanupUpload,
        reset,
        canProceed,
    };
}
