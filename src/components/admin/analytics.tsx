"use client";

import { BarChart, LineChart } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Analytics() {
  // Mock data for charts
  const userActivityData = [
    { month: "Jan", students: 120, lecturers: 15 },
    { month: "Feb", students: 150, lecturers: 18 },
    { month: "Mar", students: 180, lecturers: 20 },
    { month: "Apr", students: 220, lecturers: 22 },
    { month: "May", students: 250, lecturers: 25 },
    { month: "Jun", students: 280, lecturers: 28 },
  ];

  const courseUsageData = [
    { course: "MTE 301", downloads: 85, views: 120 },
    { course: "MTE 303", downloads: 65, views: 95 },
    { course: "MTE 305", downloads: 75, views: 110 },
    { course: "MTE 307", downloads: 55, views: 80 },
    { course: "MTE 309", downloads: 45, views: 70 },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Courses
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +2 new courses this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,845</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              Current active users
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>
              Monthly active users over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full flex items-center justify-center">
              <LineChart className="h-16 w-16 text-muted-foreground" />
              <div className="ml-4 text-sm text-muted-foreground">
                <p>This is a placeholder for the user activity chart.</p>
                <p>
                  In a real application, this would display a line chart showing
                  user activity over time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Course Usage</CardTitle>
            <CardDescription>Most accessed courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <BarChart className="h-16 w-16 text-muted-foreground" />
              <div className="ml-4 text-sm text-muted-foreground">
                <p>This is a placeholder for the course usage chart.</p>
                <p>
                  In a real application, this would display a bar chart showing
                  course usage statistics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>View detailed analytics by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="p-4">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">
                  User Analytics Dashboard
                </h3>
                <p className="text-muted-foreground">
                  This section would contain detailed user analytics including
                  registration trends, login frequency, user demographics, and
                  engagement metrics.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="courses" className="p-4">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">
                  Course Analytics Dashboard
                </h3>
                <p className="text-muted-foreground">
                  This section would contain detailed course analytics including
                  enrollment statistics, completion rates, most popular courses,
                  and student performance metrics.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="content" className="p-4">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">
                  Content Analytics Dashboard
                </h3>
                <p className="text-muted-foreground">
                  This section would contain detailed content analytics
                  including download statistics, view counts, most accessed
                  materials, and content engagement metrics.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
