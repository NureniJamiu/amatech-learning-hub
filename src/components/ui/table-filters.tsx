"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface FilterOption {
    id: string;
    label: string;
    type: "select" | "multiselect";
    options: { value: string; label: string }[];
}

export interface ActiveFilter {
    filterId: string;
    value: string | string[];
    label: string;
}

interface TableFiltersProps {
    filters: FilterOption[];
    activeFilters: ActiveFilter[];
    onFilterChange: (filterId: string, value: string | string[] | null) => void;
    onClearAll: () => void;
}

export function TableFilters({
    filters,
    activeFilters,
    onFilterChange,
    onClearAll,
}: TableFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const getFilterLabel = (filterId: string) => {
        return filters.find((f) => f.id === filterId)?.label || filterId;
    };

    const getValueLabel = (filterId: string, value: string) => {
        const filter = filters.find((f) => f.id === filterId);
        return filter?.options.find((o) => o.value === value)?.label || value;
    };

    const activeFilterCount = activeFilters.length;

    return (
        <div className="flex items-center gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <Badge
                                variant="secondary"
                                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                            >
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">Filters</h4>
                            {activeFilterCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClearAll}
                                    className="h-auto p-1 text-xs"
                                >
                                    Clear all
                                </Button>
                            )}
                        </div>

                        {filters.map((filter) => (
                            <div key={filter.id} className="space-y-2">
                                <Label className="text-xs font-medium">
                                    {filter.label}
                                </Label>
                                <Select
                                    value={
                                        activeFilters.find(
                                            (f) => f.filterId === filter.id
                                        )?.value as string | undefined
                                    }
                                    onValueChange={(value) => {
                                        if (value === "all") {
                                            onFilterChange(filter.id, null);
                                        } else {
                                            onFilterChange(filter.id, value);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder={`All ${filter.label.toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All {filter.label.toLowerCase()}
                                        </SelectItem>
                                        {filter.options.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Active filter badges */}
            {activeFilters.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    {activeFilters.map((filter) => (
                        <Badge
                            key={filter.filterId}
                            variant="secondary"
                            className="gap-1 pr-1"
                        >
                            <span className="text-xs">
                                {getFilterLabel(filter.filterId)}:{" "}
                                {Array.isArray(filter.value)
                                    ? filter.value
                                          .map((v) =>
                                              getValueLabel(filter.filterId, v)
                                          )
                                          .join(", ")
                                    : getValueLabel(
                                          filter.filterId,
                                          filter.value
                                      )}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() =>
                                    onFilterChange(filter.filterId, null)
                                }
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
