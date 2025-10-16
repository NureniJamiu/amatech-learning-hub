"use client";

import {
    Clock,
} from "lucide-react";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useRecentlyAccessed } from "@/hooks/use-recently-accessed";

export function NavRecentlyAccessed() {
    const { state } = useSidebar();
    const { recentItems } = useRecentlyAccessed();

    // Limit to 3 items for sidebar display
    const limitedItems = recentItems.slice(0, 3);

    const handleItemClick = (fileUrl?: string) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        }
    };

    if (limitedItems.length === 0) {
        return (
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                {state !== "collapsed" && (
                    <SidebarGroupLabel>Recently Accessed</SidebarGroupLabel>
                )}
                <SidebarMenu className="space-y-1">
                    <SidebarMenuItem>
                        <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-muted-foreground">
                            <Clock className="h-4 w-4 shrink-0" />
                            {state !== "collapsed" && (
                                <span className="text-xs sm:text-sm">No recent activity</span>
                            )}
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        );
    }

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden px-2">
            {state !== "collapsed" && (
                <SidebarGroupLabel>Recently Accessed</SidebarGroupLabel>
            )}
            <SidebarMenu className="space-y-1">
                {limitedItems.map((item) => {
                    return (
                        <SidebarMenuItem key={`${item.type}-${item.id}`}>
                            <SidebarMenuButton
                                onClick={() => handleItemClick(item.fileUrl)}
                                tooltip={`${item.title} - ${item.courseCode}`}
                                className="h-auto min-h-[2.5rem] px-2 sm:px-3 py-2 rounded-lg hover:bg-green-500/10 transition-colors"
                            >
                                <div className="flex flex-col items-start w-full gap-0.5 sm:gap-1">
                                    <span className="text-xs sm:text-sm font-medium truncate w-full text-left leading-tight">
                                        {item.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate w-full text-left">
                                        {item.courseCode}
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
