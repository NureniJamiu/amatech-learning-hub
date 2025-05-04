"use client";

import { useAppContext } from "@/context/app-context";
import { AdminToggle } from "@/components/admin-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  const { currentView, selectedCourse, isAdminMode } = useAppContext();

  const getViewTitle = () => {
    if (isAdminMode) return "Admin Panel";

    switch (currentView) {
      case "dashboard":
        return "Dashboard";
      case "courses":
        return "Courses";
      case "ai-assistant":
        return "AI Assistant";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{getViewTitle()}</BreadcrumbPage>
          </BreadcrumbItem>
          {currentView === "courses" && selectedCourse && !isAdminMode && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{selectedCourse.code}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <AdminToggle />
    </header>
  );
}
