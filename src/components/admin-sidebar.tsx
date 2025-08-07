"use client";

import {
  FileText,
  Settings,
  Users,
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
        { id: "users", title: "User Management", icon: Users },
        { id: "courses", title: "Course Management", icon: BookOpen },
        { id: "tutors", title: "Tutor Management", icon: UserCog },
        { id: "content", title: "Content Management", icon: FileText },
        { id: "analytics", title: "Analytics", icon: BarChart3 },
        { id: "settings", title: "System Settings", icon: Settings },
        { id: "permissions", title: "Permissions", icon: Shield },
    ];

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
                <SidebarMenu>
                    {adminMenuItems.map((item) => (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                                isActive={activeAdminSection === item.id}
                                onClick={() => setActiveAdminSection(item.id)}
                                tooltip={item.title}
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
