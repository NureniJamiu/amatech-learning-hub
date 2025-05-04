"use client";

import type React from "react";

import { GraduationCap } from "lucide-react";

import { currentUser } from "@/data/mock-data";
import { useAppContext } from "@/context/app-context";
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
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { isAdminMode } = useAppContext();

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
            {currentUser.avatar ? (
              <AvatarImage
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.name}
              />
            ) : (
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div
            className={`flex flex-col transition-opacity duration-200 ${
              state === "collapsed" ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="font-medium">{currentUser.name}</span>
            <span className="text-xs text-muted-foreground">
              {currentUser.email}
            </span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
