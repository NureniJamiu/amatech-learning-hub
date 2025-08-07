"use client";

import { Settings, Shield } from "lucide-react";
import { mainNavItems } from "@/data/mock-data";
import { useAppContext } from "@/context/app-context";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";

export function MainNav() {
    const {
        currentView,
        setCurrentView,
        isAdminMode,
        setIsAdminMode,
        currentUser,
    } = useAppContext();

    const handleAdminToggle = () => {
        setIsAdminMode(!isAdminMode);
    };

    // Function to convert navigation title to view name
    const getViewFromTitle = (
        title: string
    ): "dashboard" | "courses" | "ai-assistant" => {
        switch (title.toLowerCase()) {
            case "dashboard":
                return "dashboard";
            case "courses":
                return "courses";
            case "ai assistant":
                return "ai-assistant";
            default:
                return "dashboard";
        }
    };

    // Function to check if a navigation item is active
    const isNavActive = (title: string) => {
        const viewName = getViewFromTitle(title);
        return currentView === viewName;
    };

    return (
        <>
            <SidebarGroup>
                <SidebarMenu>
                    {mainNavItems.map((item) => (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                                isActive={isNavActive(item.title)}
                                onClick={() =>
                                    setCurrentView(getViewFromTitle(item.title))
                                }
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

            {/* Admin Mode Toggle - Only show for admin users */}
            {currentUser?.isAdmin && (
                <>
                    <SidebarSeparator />
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={isAdminMode}
                                    onClick={handleAdminToggle}
                                    variant={
                                        isAdminMode ? "default" : "outline"
                                    }
                                >
                                    <Shield className="h-4 w-4" />
                                    <span>
                                        {isAdminMode
                                            ? "Admin Mode"
                                            : "Switch to Admin"}
                                    </span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </>
            )}
        </>
    );
}
