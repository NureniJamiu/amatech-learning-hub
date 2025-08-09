"use client";

import { mainNavItems } from "@/data/mock-data";
import { useAppContext } from "@/context/app-context";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

export function MainNav() {
    const { currentView, setCurrentView, setSelectedCourse, currentUser } =
        useAppContext();

    const { state } = useSidebar();

    // Function to handle navigation click
    const handleNavClick = (title: string) => {
        const viewName = getViewFromTitle(title);
        setCurrentView(viewName);

        // If navigating to courses, clear any selected course to show the courses list
        if (viewName === "courses") {
            setSelectedCourse(null);
        }

        // If navigating to timetable, also clear selected course
        if (viewName === "timetable") {
            setSelectedCourse(null);
        }
    };

    // Function to convert navigation title to view name
    const getViewFromTitle = (
        title: string
    ): "dashboard" | "courses" | "timetable" | "ai-assistant" => {
        switch (title.toLowerCase()) {
            case "dashboard":
                return "dashboard";
            case "courses":
                return "courses";
            case "timetable":
                return "timetable";
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
                <SidebarMenu className="space-y-1">
                    {mainNavItems.map((item) => (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                                isActive={isNavActive(item.title)}
                                onClick={() => handleNavClick(item.title)}
                                tooltip={item.title}
                                className="h-9"
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
