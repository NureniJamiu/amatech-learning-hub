"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
}

const sizeClasses = {
  sm: "sm:max-w-[425px]",
  md: "sm:max-w-[500px]",
  lg: "sm:max-w-[600px]",
  xl: "sm:max-w-[700px]",
  "2xl": "sm:max-w-[800px]",
  full: "sm:max-w-[90vw]",
};

export function ModalWrapper({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "lg",
  className,
}: ModalWrapperProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          sizeClasses[size],
          "max-h-[90vh] overflow-y-auto",
          "gap-6", // Consistent spacing
          className
        )}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold leading-none tracking-tight">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
