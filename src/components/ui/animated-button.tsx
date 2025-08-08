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
    return (
        <motion.button
            ref={ref}
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                buttonVariants({ variant, size }),
                "cursor-pointer relative overflow-hidden w-auto border-2 border-transparent disabled:cursor-not-allowed",
                className
            )}
            whileHover={{
                scale: disabled ? 1 : 1.05,
                boxShadow: disabled
                    ? "none"
                    : "0 15px 35px rgba(0, 0, 0, 0.15)",
                borderColor: disabled
                    ? "transparent"
                    : "rgba(34, 197, 94, 0.3)",
            }}
            whileTap={{
                scale: disabled ? 1 : 0.95,
                boxShadow: disabled ? "none" : "0 8px 20px rgba(0, 0, 0, 0.1)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20"
                initial={{ x: "-100%", opacity: 0 }}
                whileHover={{
                    x: disabled ? "-100%" : "100%",
                    opacity: disabled ? 0 : 0.3,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <motion.span
                className="relative z-10 font-semibold"
                whileHover={{ scale: disabled ? 1 : 1.02 }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.span>
        </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
