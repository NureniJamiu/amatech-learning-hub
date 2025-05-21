import { useState } from "react";
import {
  uploadToCloudinary,
  uploadImage,
  uploadPdf,
  uploadVideo,
} from "@/lib/cloudinary";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UseFileUploadOptions {
  defaultUploadPreset?: string;
  defaultFolder?: string;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

interface UseFileUploadReturn {
  fileUrl: string;
  publicId: string;
  status: UploadStatus;
  error: string | null;
  progress: number;
  isUploading: boolean;
  uploadFile: (file: File, uploadPreset?: string, options?: any) => Promise<string>;
  uploadImage: (file: File, uploadPreset?: string, options?: any) => Promise<string>;
  uploadPdf: (file: File, uploadPreset?: string, options?: any) => Promise<string>;
  uploadVideo: (file: File, uploadPreset?: string, options?: any) => Promise<string>;
  deleteFile: () => Promise<void>;
  reset: () => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [publicId, setPublicId] = useState<string>("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const { defaultUploadPreset, defaultFolder, onSuccess, onError } = options;

  const reset = () => {
    setFileUrl("");
    setPublicId("");
    setStatus("idle");
    setError(null);
    setProgress(0);
  };

  const handleResponse = (response: any) => {
    if (response.error) throw new Error(response.error);
    console.log("Upload response:", response);
    setFileUrl(response.secureUrl || response.secure_url);
    setPublicId(response.publicId);
    setProgress(100);
    setStatus("success");
    onSuccess?.(response.secureUrl || response.secure_url);
    return response.secureUrl || response.secure_url;
  };

  const simulateProgress = () => {
    return setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress < 90 ? newProgress : 90;
      });
    }, 500);
  };

  const uploadFile = async (
    file: File,
    uploadPreset?: string,
    options?: any
  ): Promise<string> => {
    if (!file) {
      const error = new Error("No file provided");
      setError(error.message);
      onError?.(error);
      return "";
    }

    if (!uploadPreset && !defaultUploadPreset) {
      const error = new Error("Upload preset is required");
      setError(error.message);
      onError?.(error);
      return "";
    }

    try {
      setStatus("uploading");
      setProgress(10);
      const interval = simulateProgress();

      const res = await uploadToCloudinary(file, {
        uploadPreset: uploadPreset || defaultUploadPreset!,
        folder: options?.folder || defaultFolder,
        ...options,
      });

      clearInterval(interval);
      return handleResponse(res);
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Upload failed");
      onError?.(err instanceof Error ? err : new Error(err.toString()));
      return "";
    }
  };

  const uploadImageFile = async (file: File, uploadPreset?: string, options?: any): Promise<string> => {
    try {
      setStatus("uploading");
      setProgress(10);
      const interval = simulateProgress();

      const res = await uploadImage(file, uploadPreset || defaultUploadPreset!, {
        folder: options?.folder || defaultFolder,
        ...options,
      });

      clearInterval(interval);
      return handleResponse(res);
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Image upload failed");
      onError?.(err instanceof Error ? err : new Error(err.toString()));
      return "";
    }
  };

  const uploadPdfFile = async (file: File, uploadPreset?: string, options?: any): Promise<string> => {
    try {
      setStatus("uploading");
      setProgress(10);
      const interval = simulateProgress();

      const res = await uploadPdf(file, uploadPreset || defaultUploadPreset!, {
        folder: options?.folder || defaultFolder,
        ...options,
      });

      clearInterval(interval);
      return handleResponse(res);
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "PDF upload failed");
      onError?.(err instanceof Error ? err : new Error(err.toString()));
      return "";
    }
  };

  const uploadVideoFile = async (file: File, uploadPreset?: string, options?: any): Promise<string> => {
    try {
      setStatus("uploading");
      setProgress(10);
      const interval = simulateProgress();

      const res = await uploadVideo(file, uploadPreset || defaultUploadPreset!, {
        folder: options?.folder || defaultFolder,
        ...options,
      });

      clearInterval(interval);
      return handleResponse(res);
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Video upload failed");
      onError?.(err instanceof Error ? err : new Error(err.toString()));
      return "";
    }
  };

  const deleteFile = async (): Promise<void> => {
    console.log("Deleting file with publicId:", publicId);
    if (!publicId) return;

    reset(); // Optimistically reset UI

    try {
      const res = await fetch("/api/v1/cloudinary/delete-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete file from Cloudinary");
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error("Cloudinary deletion failed");
      }
    } catch (err: any) {
      console.error("Deletion error:", err);
      // Optionally: show toast or rollback state
    }
  };

  return {
    fileUrl,
    publicId,
    status,
    error,
    progress,
    uploadFile,
    uploadImage: uploadImageFile,
    uploadPdf: uploadPdfFile,
    uploadVideo: uploadVideoFile,
    deleteFile,
    reset,
    isUploading: status === "uploading",
  };
}

export default useFileUpload;
