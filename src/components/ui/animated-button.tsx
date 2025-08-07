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
        className={cn(buttonVariants({ variant, size }), "relative overflow-hidden w-auto", className)}
        whileHover={{
          scale: disabled ? 1 : 1.02,
          boxShadow: disabled ? "none" : "0 10px 25px rgba(0, 0, 0, 0.1)"
        }}
        whileTap={{
          scale: disabled ? 1 : 0.98,
          boxShadow: disabled ? "none" : "0 5px 15px rgba(0, 0, 0, 0.1)"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: disabled ? "-100%" : "100%" }}
          transition={{ duration: 0.6 }}
        />
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
