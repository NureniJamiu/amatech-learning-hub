"use client";

import { useSidebarContext } from "@/context/sidebar-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DownloadIcon, ExternalLinkIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
    <div className="grid grid-cols-6 gap-3 space-y-6">
      <div className="col-span-4 space-y-3">
        <Card className="relative rounded-md">
          {/* <Badge */}
          <CardHeader>
            <CardTitle className="text-2xl">
              {selectedItem.title} - Engineering Economics
            </CardTitle>
            <hr className="my-2" />
            <CardDescription className="text-base">
              Engineering Economics is a course that focuses on the application
              of economic principles to engineering projects and
              decision-making. It covers topics such as cost analysis, project
              evaluation, and financial management in engineering contexts.
            </CardDescription>
            {/* <CardDescription>Section: {selectedItem.section}</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* {selectedItem.section === "Platform" && (
              <>
                <h3 className="text-lg font-medium">Platform Content</h3>
                <p>
                  This is the content for {selectedItem.title} in the{" "}
                  {selectedItem.section} section.
                </p>
                {selectedItem.title === "Courses" && (
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

            {selectedItem.section === "Bookmarks" && (
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
            )} */}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-xs p-0 m-0">
          <CardContent className="p-0 m-3">
            <div className="space-y-3">
              <h2 className="text-base font-semibold">
                Available Course Material(s)
              </h2>

              <div className="flex items-center justify-between bg-gray-50 rounded text-sm px-3 py-3">
                <p className="flex-1 text-red-500">MTE 301 Course Material 1</p>

                <div className="flex items-center gap-3 text-xs">
                  <ActionBtn
                    title="Open"
                    icon={<ExternalLinkIcon size={15} />}
                    className="text-blue-500"
                  />
                  <ActionBtn
                    title="Download"
                    icon={<DownloadIcon size={15} />}
                    className="text-green-500"
                  />
                  {/* <ActionBtn
                        title="Bookmark"
                        icon={<BookmarkIcon size={15} />}
                        className="text-red-500"
                      /> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-2 space-y-3">
        <Card className="min-h-32 rounded-md">
          <CardContent className="space-y-3">
            <h4 className="text-lg font-semibold ">Tutor(s)</h4>
            <p className="text-sm text-gray-700">Unavailable...</p>
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
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
      </div> */}
    </div>
  );
}

const ActionBtn = ({
  title,
  icon,
  className,
}: {
  title: string;
  icon: ReactNode;
  className: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs cursor-pointer",
        className
      )}
    >
      <span>{title}</span>
      <span>{icon}</span>
    </div>
  );
};
