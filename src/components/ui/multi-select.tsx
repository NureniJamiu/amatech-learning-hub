"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/utils";

export type Option = {
  value: string;
  label: string;
  disable?: boolean;
};

interface MultiSelectProps {
  options?: Option[];
  selected?: string[];
  onValueChange?: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
}

export function MultiSelect({
  options = [],
  selected = [],
  onValueChange,
  className,
  placeholder = "Select options",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedOptions, setSelectedOptions] =
    React.useState<string[]>(selected);

  React.useEffect(() => {
    setSelectedOptions(selected);
  }, [selected]);

  const handleSelect = (option: string) => {
    const newSelected = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(newSelected);
    onValueChange?.(newSelected);
  };

  const handleRemove = (option: string) => {
    const newSelected = selectedOptions.filter((item) => item !== option);
    setSelectedOptions(newSelected);
    onValueChange?.(newSelected);
  };

  const selectedLabels = selectedOptions
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter(Boolean) as string[];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            className
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selectedLabels.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {selectedLabels.map((label, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {label}
                <button
                  type="button"
                  className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleRemove(selectedOptions[i])}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {label}</span>
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 opacity-50"
              aria-hidden="true"
            >
              <path
                d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedOptions.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disable}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Update the MultiSelectTrigger component to properly use PopoverTrigger:
export const MultiSelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof PopoverTrigger>
>(({ className, children, ...props }, ref) => (
  <PopoverTrigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
  </PopoverTrigger>
));
MultiSelectTrigger.displayName = "MultiSelectTrigger";

export const MultiSelectValue = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { placeholder?: string }
>(({ className, placeholder = "Select options", children, ...props }, ref) => {
  const { options, selectedOptions, handleRemove } =
    React.useContext(MultiSelectContext);

  return (
    <div ref={ref} className={`flex flex-wrap gap-1 ${className}`} {...props}>
      {selectedOptions.length === 0 && (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
      {selectedOptions.map((option) => {
        const optionData = options.find((o) => o.value === option);
        return optionData ? (
          <Badge
            key={option}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {optionData.label}
            <button
              type="button"
              className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={() => handleRemove(option)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {optionData.label}</span>
            </button>
          </Badge>
        ) : null;
      })}
    </div>
  );
});
MultiSelectValue.displayName = "MultiSelectValue";

export const MultiSelectContent = PopoverContent;
export const MultiSelectItem = CommandItem;

const MultiSelectContext = React.createContext<{
  options: Option[];
  selectedOptions: string[];
  handleRemove: (option: string) => void;
}>({
  options: [],
  selectedOptions: [],
  handleRemove: () => {},
});
