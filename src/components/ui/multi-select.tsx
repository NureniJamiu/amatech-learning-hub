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
  children?: React.ReactNode;
}

export function MultiSelect({
  options = [],
  selected = [],
  onValueChange,
  className,
  placeholder = "Select options",
  children,
  ...props
}: MultiSelectProps &
  Omit<React.ComponentPropsWithoutRef<typeof PopoverTrigger>, "onChange">) {
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

  // Create context value
  const contextValue = React.useMemo(
    () => ({
      options: options || [],
      selectedOptions,
      handleRemove,
    }),
    [options, selectedOptions]
  );

  return (
    <MultiSelectContext.Provider value={contextValue}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={className} {...props}>
          {children}
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
                        className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        }`}
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
    </MultiSelectContext.Provider>
  );
}

export const MultiSelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof PopoverTrigger>
>(({ className, children, ...props }, ref) => (
  <PopoverTrigger
    ref={ref}
    className={`flex h-10 w-full items-center justify-between rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${className}`}
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
              className="rounded outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
