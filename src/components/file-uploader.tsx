"use client";

import React, { useRef, useState } from "react";
import { CircleUserRoundIcon, FileTextIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useFileUpload from "@/hooks/useFileUpload";

interface FileUploaderProps {
    uploadPreset: string;
    folder?: string;
    onUploadComplete?: (file: File | string) => void; // Support both File and URL for backward compatibility
    onUploadError?: (error: string) => void;
    initialImageUrl?: string;
    className?: string;
    accept?: string;
    autoUpload?: boolean; // New prop to control when upload happens
}

export default function FileUploader({
    uploadPreset,
    folder,
    onUploadComplete,
    onUploadError,
    initialImageUrl = "",
    className = "",
    accept = "image/*",
    autoUpload = false, // Default to false for transactional uploads
}: FileUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { fileUrl, status, error, progress, uploadFile, isUploading, reset } =
        useFileUpload({
            defaultUploadPreset: uploadPreset,
            defaultFolder: folder,
            onSuccess: (url) => {
                setPreviewUrl(url);
                // For auto uploads, pass the URL (backward compatibility)
                if (autoUpload && onUploadComplete) {
                    onUploadComplete(url);
                }
            },
            onError: (error) => {
                onUploadError?.(error.message);
            },
        });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;

        setSelectedFile(file);

        const isImage = file.type.startsWith("image/");
        if (isImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl("");
        }

        // Only auto-upload if autoUpload is true (for backward compatibility)
        if (autoUpload) {
            try {
                const url = await uploadFile(
                    file,
                    uploadPreset,
                    folder ? { folder } : {}
                );
                if (url) setPreviewUrl(url);
            } catch (err) {
                console.error("Upload failed", err);
                onUploadError?.(
                    err instanceof Error ? err.message : "Upload failed"
                );
            }
        } else {
            // For transactional uploads, just call onUploadComplete with the file
            onUploadComplete?.(file);
        }
    };

    // Method to manually trigger upload (for transactional pattern)
    const triggerUpload = async (): Promise<string | null> => {
        if (!selectedFile) return null;

        try {
            const url = await uploadFile(
                selectedFile,
                uploadPreset,
                folder ? { folder } : {}
            );
            return url;
        } catch (err) {
            console.error("Upload failed", err);
            onUploadError?.(
                err instanceof Error ? err.message : "Upload failed"
            );
            return null;
        }
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        fileInputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        reset();
        setPreviewUrl("");
        setSelectedFile(null);
        // Reset parent component's file state
        onUploadComplete?.(null as any);
    };

    const fileName = selectedFile?.name;
    const isImage = selectedFile?.type.startsWith("image/");

    // Note: We removed the useImperativeHandle as it was causing type conflicts
    // The triggerUpload method can be accessed directly from the hook if needed

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div className="inline-flex items-center gap-2 align-top">
                <div
                    className="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
                    aria-label={
                        previewUrl
                            ? "Preview of uploaded file"
                            : "Default file icon"
                    }
                >
                    {previewUrl && isImage ? (
                        <img
                            className="size-full object-cover"
                            src={previewUrl}
                            alt="Preview"
                            width={32}
                            height={32}
                        />
                    ) : (
                        <div aria-hidden="true">
                            {isImage ? (
                                <CircleUserRoundIcon
                                    className="opacity-60"
                                    size={16}
                                />
                            ) : (
                                <FileTextIcon
                                    className="opacity-60"
                                    size={16}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="relative inline-block">
                    <Button
                        type="button"
                        onClick={handleButtonClick}
                        aria-haspopup="dialog"
                        disabled={isUploading}
                    >
                        {fileName ? "Change file" : "Upload file"}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="sr-only"
                        aria-label="Upload file"
                        tabIndex={-1}
                    />
                </div>
            </div>

            {fileName && (
                <div className="inline-flex gap-2 text-xs mt-1">
                    <p
                        className="text-muted-foreground truncate"
                        aria-live="polite"
                    >
                        {fileName}
                    </p>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="cursor-pointer text-destructive font-medium hover:underline"
                        aria-label={`Remove ${fileName}`}
                    >
                        Remove
                    </button>
                </div>
            )}

            {isUploading && (
                <div className="w-full mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(progress)}% uploading
                    </p>
                </div>
            )}

            {error && (
                <p className="text-xs text-red-500 mt-1">
                    Upload error: {error}
                </p>
            )}

            {status === "success" && !autoUpload && (
                <p className="text-xs text-green-600 mt-1">
                    File ready for upload!
                </p>
            )}

            {status === "success" && autoUpload && (
                <p className="text-xs text-green-600 mt-1">
                    Upload successful!
                </p>
            )}
        </div>
    );
}
