"use client";

import { mainNavItems } from "@/data/mock-data";
import { useAppContext } from "@/context/app-context";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function MainNav() {
  const { currentView, setCurrentView } = useAppContext();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {mainNavItems.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              isActive={
                currentView === item.title.toLowerCase().replace(" ", "-")
              }
              onClick={() =>
                setCurrentView(
                  item.title.toLowerCase().replace(" ", "-") as any
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
