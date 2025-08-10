"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-medium leading-none tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function FormField({
  label,
  required = false,
  error,
  hint,
  children,
  className
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  );
}

export function FormGrid({ children, columns = 2, className }: FormGridProps) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className={cn("grid gap-4", gridClass[columns], className)}>
      {children}
    </div>
  );
}

export function FormActions({ children, className, align = "right" }: FormActionsProps) {
  const alignClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div className={cn(
      "flex flex-col-reverse gap-3 sm:flex-row sm:gap-3",
      alignClass[align],
      className
    )}>
      {children}
    </div>
  );
}
