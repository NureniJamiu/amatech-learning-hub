"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { type VariantProps } from "class-variance-authority";

interface AnimatedButtonProps
  extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, children, onClick, type = "button", disabled = false }, ref) => {
        // Determine border color for outline/ghost
        const borderColor =
            variant === "outline" || variant === "ghost"
                ? "border-green-600"
                : "border-transparent";

        return (
            <motion.button
                ref={ref}
                type={type}
                disabled={disabled}
                onClick={onClick}
                className={cn(
                    buttonVariants({ variant, size }),
                    `cursor-pointer relative overflow-hidden w-auto border-2 ${borderColor} disabled:cursor-not-allowed`,
                    className
                )}
                whileHover={{
                    scale: disabled ? 1 : 1.01,
                    boxShadow: disabled ? "none" : "0 4px 12px rgba(0,0,0,0.08)",
                }}
                whileTap={{
                    scale: disabled ? 1 : 0.98,
                    boxShadow: disabled ? "none" : "0 2px 6px rgba(0,0,0,0.06)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Remove animated gradient for more formal look */}
                <span className="relative z-10 font-semibold">{children}</span>
            </motion.button>
        );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
