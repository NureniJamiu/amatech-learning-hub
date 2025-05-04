"use client";

import {
  FileText,
  Settings,
  Users,
  BookOpen,
  BarChart3,
  Shield,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const adminMenuItems = [
    { id: "admin-1", title: "User Management", icon: Users },
    { id: "admin-2", title: "Course Management", icon: BookOpen },
    { id: "admin-3", title: "Content Management", icon: FileText },
    { id: "admin-4", title: "Analytics", icon: BarChart3 },
    { id: "admin-5", title: "System Settings", icon: Settings },
    { id: "admin-6", title: "Permissions", icon: Shield },
  ];

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
        <SidebarMenu>
          {adminMenuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
