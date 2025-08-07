"use client";

import type React from "react";

import { GraduationCap, LogOut } from "lucide-react";
import { toast } from "react-toastify";

import { useAppContext } from "@/context/app-context";
import { logout } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { CourseSidebar } from "@/components/course-sidebar";
import { MainNav } from "@/components/main-nav";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { isAdminMode, currentUser } = useAppContext();

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
      <Sidebar collapsible="icon" {...props}>
          <SidebarHeader className="border-b pb-2">
              <div className="flex items-center gap-2 px-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-green-500 text-white">
                      <GraduationCap className="h-5 w-5" />
                  </div>
                  <div
                      className={`flex flex-col transition-opacity duration-200 ${
                          state === "collapsed" ? "opacity-0" : "opacity-100"
                      }`}
                  >
                      <span className="font-semibold">Amatech Lasu</span>
                      <span className="text-xs text-muted-foreground">
                          Student Learning Hub
                      </span>
                  </div>
              </div>
          </SidebarHeader>
          <SidebarContent>
              <MainNav />
              {isAdminMode ? <AdminSidebar /> : <CourseSidebar />}
          </SidebarContent>
          <SidebarFooter className="border-t">
              <div className="flex items-center gap-3 p-3">
                  <Avatar>
                      {currentUser?.avatar ? (
                          <AvatarImage
                              src={currentUser.avatar}
                              alt={currentUser.name}
                          />
                      ) : (
                          <AvatarFallback>
                              {currentUser?.name
                                  ? currentUser.name.charAt(0).toUpperCase()
                                  : "U"}
                          </AvatarFallback>
                      )}
                  </Avatar>
                  <div
                      className={`flex flex-col transition-opacity duration-200 ${
                          state === "collapsed" ? "opacity-0" : "opacity-100"
                      }`}
                  >
                      <span className="font-medium">
                          {currentUser?.name || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                          {currentUser?.email || "user@example.com"}
                      </span>
                      {currentUser?.level && (
                          <span className="text-xs text-muted-foreground">
                              Level {currentUser.level} • Semester{" "}
                              {currentUser.currentSemester || 1}
                          </span>
                      )}
                  </div>
              </div>
              <SidebarMenu>
                  <SidebarMenuItem>
                      <SidebarMenuButton
                          onClick={handleLogout}
                          className="w-full"
                      >
                          <LogOut className="h-4 w-4" />
                          <span>
                              Logout
                          </span>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
      </Sidebar>
  );
}
