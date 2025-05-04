"use client";

import { useSidebarContext } from "@/context/sidebar-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardContent() {
  const { selectedItem } = useSidebarContext();

  if (!selectedItem) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select an item from the sidebar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{selectedItem.title}</CardTitle>
          <CardDescription>Section: {selectedItem.section}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {selectedItem.section === "Platform" && (
              <>
                <h3 className="text-lg font-medium">Platform Content</h3>
                <p>
                  This is the content for {selectedItem.title} in the{" "}
                  {selectedItem.section} section.
                </p>
                {selectedItem.title === "Playground" && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p>
                      Welcome to the Playground! This is where you can
                      experiment with different models and settings.
                    </p>
                  </div>
                )}
                {selectedItem.title === "Models" && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p>Browse and manage your AI models here.</p>
                  </div>
                )}
                {selectedItem.title === "Documentation" && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p>
                      Find comprehensive guides and API references in our
                      documentation.
                    </p>
                  </div>
                )}
                {selectedItem.title === "Settings" && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p>Configure your account and application settings.</p>
                  </div>
                )}
              </>
            )}

            {selectedItem.section === "Projects" && (
              <>
                <h3 className="text-lg font-medium">Project Details</h3>
                <p>You are viewing the {selectedItem.title} project.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Project Stats</h4>
                    <p>Active users: 1,245</p>
                    <p>Tasks completed: 89%</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Recent Activity</h4>
                    <p>Last updated: 2 hours ago</p>
                    <p>Contributors: 8</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 p-4">
          <h3 className="font-medium mb-2">Analytics</h3>
          <p className="text-sm text-muted-foreground">
            View performance metrics
          </p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 p-4">
          <h3 className="font-medium mb-2">Resources</h3>
          <p className="text-sm text-muted-foreground">Access helpful guides</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 p-4">
          <h3 className="font-medium mb-2">Support</h3>
          <p className="text-sm text-muted-foreground">Get help when needed</p>
        </div>
      </div>
    </div>
  );
}
