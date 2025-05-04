import { AppContent } from "@/components/app-content";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AppProvider } from "@/context/app-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPage() {
  return (
    <AppProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col p-6">
            <AppContent />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  );
}
