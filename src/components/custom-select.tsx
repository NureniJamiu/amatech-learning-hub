import { useId } from "react";

import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

export default function CustomSelect({
    label,
    options,
    value,
    onChange,
    disabled,
    className,
}: {
    label: string;
    options: Option[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    className?: string;
}) {
    const id = useId();
    return (
        <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
            <Label htmlFor={id}>{label}</Label>
            <SelectNative
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={className}
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </SelectNative>
        </div>
    );
}
