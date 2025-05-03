import { useId } from "react";

import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";

interface Option {
  value: string;
  label: string;
}

export default function CustomSelect({
  label,
  options,
}: {
  label: string;
  options: Option[];
}) {
  const id = useId();
  return (
    <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
      <Label htmlFor={id}>{label}</Label>
      <SelectNative id={id}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectNative>
    </div>
  );
}
