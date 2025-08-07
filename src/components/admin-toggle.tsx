"use client";

import { Shield } from "lucide-react";

import { useAppContext } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AdminToggle() {
    const { isAdminMode, setIsAdminMode, currentUser } = useAppContext();

    // Only render if the user exists and is an admin
    if (!currentUser || !currentUser.isAdmin) {
        return null;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={isAdminMode ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsAdminMode(!isAdminMode)}
                    >
                        <Shield
                            className={`h-4 w-4 ${
                                isAdminMode
                                    ? "text-white"
                                    : "text-muted-foreground"
                            }`}
                        />
                        <span className="sr-only">Toggle Admin Mode</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        {isAdminMode ? "Exit Admin Mode" : "Enter Admin Mode"}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
