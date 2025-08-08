"use client";

import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function CustomPasswordConfirmation({
    value = "",
    onChange,
    disabled,
    className,
    label = "Confirm Password",
    placeholder = "Confirm your password",
}: {
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    label?: string;
    placeholder?: string;
}) {
    const id = useId();
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    return (
        <div className={cn("w-full", className)}>
            <div className="*:not-first:mt-2">
                <Label htmlFor={id}>{label}</Label>
                <div className="relative">
                    <Input
                        id={id}
                        className="pe-9"
                        placeholder={placeholder}
                        type={isVisible ? "text" : "password"}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={disabled}
                    />
                    <button
                        className="cursor-pointer text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={
                            isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isVisible}
                        aria-controls="password"
                        disabled={disabled}
                    >
                        {isVisible ? (
                            <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                            <EyeIcon size={16} aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
