"use client";

import {
    Book,
    ChevronDown,
    Loader2,
    FileText,
    NotebookPen,
} from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { NavRecentlyAccessed } from "@/components/nav-recently-accessed";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

export function CourseSidebar() {
    const {
        selectedCourse,
        setSelectedCourse,
        filteredCourses,
        filterLevel,
        setFilterLevel,
        filterSemester,
        setFilterSemester,
        availableLevels,
        setCurrentView,
        currentUser,
        currentView,
    } = useAppContext();

    const { state } = useSidebar();

    const handleCourseClick = (course: any) => {
        setSelectedCourse(course);
        setCurrentView("courses");
    };

    return (
        <>
            <SidebarGroup>
                {state !== "collapsed" && (
                    <div className="flex items-center justify-between px-2 mb-2">
                        <SidebarGroupLabel className="mb-0">
                            Courses
                        </SidebarGroupLabel>
                        <ChevronDown className="h-4 w-4" />
                    </div>
                )}

                {state !== "collapsed" && (
                    <div className="px-2 mb-4 flex flex-col gap-2">
                        <Select
                            value={filterLevel.toString()}
                            onValueChange={(value) => {
                                setFilterLevel(Number.parseInt(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-full">
                                <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableLevels.map((level) => (
                                    <SelectItem
                                        key={level}
                                        value={level.toString()}
                                    >
                                        {level} Level
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filterSemester.toString()}
                            onValueChange={(value) => {
                                setFilterSemester(
                                    Number.parseInt(value) as 1 | 2
                                );
                            }}
                        >
                            <SelectTrigger className="h-8 w-full">
                                <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1st Semester</SelectItem>
                                <SelectItem value="2">2nd Semester</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <SidebarMenu
                    className={`space-y-1 px-2 ${
                        state === "collapsed" ? "mt-0" : ""
                    }`}
                >
                    {filteredCourses.length === 0
                        ? state !== "collapsed" && (
                              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                                  No courses found for Level {filterLevel},
                                  Semester {filterSemester}
                              </div>
                          )
                        : filteredCourses.map((course) => (
                              <SidebarMenuItem key={course.id}>
                                  <SidebarMenuButton
                                      isActive={
                                          selectedCourse?.id === course.id &&
                                          currentView === "courses"
                                      }
                                      onClick={() => handleCourseClick(course)}
                                      tooltip={`${course.code} - ${course.title}`}
                                      className={`h-9 rounded-lg transition-all duration-200 ${
                                          selectedCourse?.id === course.id && currentView === "courses"
                                              ? "bg-green-500/20 text-green-700 border border-green-500/30"
                                              : "hover:bg-green-500/10"
                                      }`}
                                  >
                                      <NotebookPen className="h-4 w-4 shrink-0" />
                                      <span className="font-medium">
                                          {course.code}
                                      </span>
                                  </SidebarMenuButton>
                              </SidebarMenuItem>
                          ))}
                </SidebarMenu>
            </SidebarGroup>

            <NavRecentlyAccessed />
        </>
    );
}
