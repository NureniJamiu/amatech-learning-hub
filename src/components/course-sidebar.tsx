"use client";

import { Book, ChevronDown, Loader2 } from "lucide-react";

import { bookmarks } from "@/data/mock-data";
import { useAppContext } from "@/context/app-context";
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

    // Log current filter state for debugging
    console.log("CourseSidebar - Current filters:", {
        filterLevel,
        filterSemester,
        availableLevels,
        currentUserLevel: currentUser?.level,
        currentUserSemester: currentUser?.currentSemester,
        filteredCoursesCount: filteredCourses.length,
    });

    const handleCourseClick = (course: any) => {
        console.log("CourseSidebar - Course clicked:", {
            courseId: course.id,
            courseCode: course.code,
            courseTitle: course.title,
            currentView: currentView
        });
        setSelectedCourse(course);
        setCurrentView("courses");
        console.log("CourseSidebar - After setting course and view:", {
            selectedCourse: course,
            newView: "courses"
        });
    };

    return (
        <>
            <SidebarGroup>
                <div className="flex items-center justify-between px-2 mb-2">
                    <SidebarGroupLabel className="mb-0">
                        Courses
                    </SidebarGroupLabel>
                    <ChevronDown className="h-4 w-4" />
                </div>

                <div className="px-2 mb-4 flex flex-col gap-2">
                    <Select
                        value={filterLevel.toString()}
                        onValueChange={(value) => {
                            console.log("CourseSidebar - Level filter changed:", value);
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
                            console.log("CourseSidebar - Semester filter changed:", value);
                            setFilterSemester(Number.parseInt(value) as 1 | 2);
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

                    {/* Debug panel - remove in production */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="p-2 bg-gray-100 rounded text-xs">
                            <div>Debug Info:</div>
                            <div>Level: {filterLevel}</div>
                            <div>Semester: {filterSemester}</div>
                            <div>Courses: {filteredCourses.length}</div>
                            <div>View: {currentView}</div>
                        </div>
                    )}
                </div>

                <SidebarMenu>
                    {filteredCourses.length === 0 ? (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                            No courses found for Level {filterLevel}, Semester{" "}
                            {filterSemester}
                        </div>
                    ) : (
                        filteredCourses.map((course) => (
                            <SidebarMenuItem key={course.id}>
                                <SidebarMenuButton
                                    isActive={selectedCourse?.id === course.id && currentView === "courses"}
                                    onClick={() => handleCourseClick(course)}
                                >
                                    <Book className="h-4 w-4" />
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">
                                            {course.code}
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate w-full">
                                            {course.title}
                                        </span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                    )}
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Bookmarks</SidebarGroupLabel>
                <SidebarMenu>
                    {bookmarks.map((bookmark) => (
                        <SidebarMenuItem key={bookmark.id}>
                            <SidebarMenuButton asChild>
                                <a href={bookmark.url}>
                                    <bookmark.icon className="h-4 w-4" />
                                    <span>{bookmark.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
