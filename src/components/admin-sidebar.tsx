"use client";

import {
  FileText,
  Settings,
  BookOpen,
  BarChart3,
  Shield,
  UserCog,
} from "lucide-react";

import { useAppContext } from "@/context/app-context";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
    const { activeAdminSection, setActiveAdminSection } = useAppContext();
    const { state } = useSidebar();

    const adminMenuItems = [
        { id: "courses", title: "Course Management", icon: BookOpen },
        { id: "tutors", title: "Tutor Management", icon: UserCog },
        { id: "content", title: "Content Management", icon: FileText },
        { id: "analytics", title: "Analytics", icon: BarChart3 },
        { id: "settings", title: "System Settings", icon: Settings },
        { id: "permissions", title: "Permissions", icon: Shield },
    ];

    return (
        <>
            <SidebarGroup className="px-2">
                <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
                <SidebarMenu className="space-y-1">
                    {adminMenuItems.map((item) => (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                                isActive={activeAdminSection === item.id}
                                onClick={() => setActiveAdminSection(item.id)}
                                tooltip={item.title}
                                className={`h-10 rounded transition-all duration-200 ${
                                    activeAdminSection === item.id
                                        ? "bg-green-400 text-white shadow-md"
                                        : "hover:bg-green-300/10 hover:text-green-700"
                                }`}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span className="font-medium">{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
