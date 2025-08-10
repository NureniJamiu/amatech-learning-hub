"use client";

import React, { useState, useRef } from "react";
import { Upload, File, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

export interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  error?: string;
  progress?: number;
  className?: string;
}

export function FileUploadZone({
  onFileSelect,
  accept = "*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  disabled = false,
  loading = false,
  error,
  helperText,
  className,
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || loading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled || loading) return;

    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    if (maxSize && file.size > maxSize) {
      // Handle size error through parent component
      return false;
    }
    return true;
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          "hover:bg-muted/50",
          dragActive && "border-primary bg-primary/5",
          error && "border-destructive bg-destructive/5",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && !loading && "cursor-pointer",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!disabled && !loading ? onButtonClick : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled || loading}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 rounded-full bg-muted">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">
              {loading ? "Processing..." : "Drop files here or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground">
              {helperText || `Maximum file size: ${formatFileSize(maxSize)}`}
            </p>
          </div>

          {!loading && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick();
              }}
            >
              Choose File
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}

export function FilePreview({
  file,
  onRemove,
  error,
  progress,
  className
}: FilePreviewProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border bg-muted/50",
      error && "border-destructive bg-destructive/5",
      className
    )}>
      <div className="p-2 rounded bg-background">
        <File className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate">{file.name}</p>
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove file</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          {progress !== undefined && (
            <>
              <span>•</span>
              <span>{progress}% uploaded</span>
            </>
          )}
          {error && (
            <>
              <span>•</span>
              <span className="text-destructive">Upload failed</span>
            </>
          )}
        </div>

        {progress !== undefined && progress < 100 && (
          <Progress value={progress} className="h-1" />
        )}

        {progress === 100 && !error && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            <span className="text-xs">Upload complete</span>
          </div>
        )}
      </div>
    </div>
  );
}
