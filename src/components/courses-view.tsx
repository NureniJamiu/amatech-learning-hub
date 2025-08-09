"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/context/app-context";
import { useUserLevelCourses } from "@/hooks/use-courses";
import { CourseCard } from "@/components/course-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Course } from "@/types";

export function CoursesView() {
  const { setSelectedCourse, setCurrentView, currentUser } = useAppContext();
  const [activeSemester, setActiveSemester] = useState<"1" | "2">("1");

  // Get courses from API - using optimized hook for user's level
  const { data: coursesResponse, isLoading } = useUserLevelCourses(
    currentUser?.level || 0,
    !!currentUser?.level
  );

  // Filter courses by user's level and semester
  const coursesBySemester = useMemo(() => {
    if (!coursesResponse?.courses || !currentUser) {
      return { semester1: [], semester2: [] };
    }

    const userLevelCourses = coursesResponse.courses;

    return {
      semester1: userLevelCourses.filter((course: Course) => course.semester === 1),
      semester2: userLevelCourses.filter((course: Course) => course.semester === 2),
    };
  }, [coursesResponse?.courses, currentUser]);

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView("courses");
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading user information...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="flex flex-col space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  My Courses
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                  Level {currentUser.level} courses for {currentUser.department}
              </p>
          </div>

          <Tabs
              value={activeSemester}
              onValueChange={(value) => setActiveSemester(value as "1" | "2")}
              className="w-full"
          >
              <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                      value="1"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                      <span className="hidden sm:inline">First Semester</span>
                      <span className="sm:hidden">Sem 1</span>
                      <span className="text-xs bg-muted px-1 sm:px-2 py-1 rounded">
                          {coursesBySemester.semester1.length}
                      </span>
                  </TabsTrigger>
                  <TabsTrigger
                      value="2"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                      <span className="hidden sm:inline">Second Semester</span>
                      <span className="sm:hidden">Sem 2</span>
                      <span className="text-xs bg-muted px-1 sm:px-2 py-1 rounded">
                          {coursesBySemester.semester2.length}
                      </span>
                  </TabsTrigger>
              </TabsList>

              <TabsContent value="1" className="mt-4 sm:mt-6">
                  <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h2 className="text-lg sm:text-xl font-semibold">
                              First Semester Courses
                          </h2>
                          <p className="text-sm text-muted-foreground">
                              {coursesBySemester.semester1.length} course
                              {coursesBySemester.semester1.length !== 1
                                  ? "s"
                                  : ""}
                          </p>
                      </div>

                      {coursesBySemester.semester1.length === 0 ? (
                          <div className="text-center py-8 sm:py-12">
                              <p className="text-sm sm:text-base text-muted-foreground">
                                  No courses available for first semester
                              </p>
                          </div>
                      ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                              {coursesBySemester.semester1.map(
                                  (course: Course) => (
                                      <CourseCard
                                          key={course.id}
                                          course={course}
                                          onViewDetails={handleViewCourse}
                                      />
                                  )
                              )}
                          </div>
                      )}
                  </div>
              </TabsContent>

              <TabsContent value="2" className="mt-4 sm:mt-6">
                  <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h2 className="text-lg sm:text-xl font-semibold">
                              Second Semester Courses
                          </h2>
                          <p className="text-sm text-muted-foreground">
                              {coursesBySemester.semester2.length} course
                              {coursesBySemester.semester2.length !== 1
                                  ? "s"
                                  : ""}
                          </p>
                      </div>

                      {coursesBySemester.semester2.length === 0 ? (
                          <div className="text-center py-8 sm:py-12">
                              <p className="text-sm sm:text-base text-muted-foreground">
                                  No courses available for second semester
                              </p>
                          </div>
                      ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                              {coursesBySemester.semester2.map(
                                  (course: Course) => (
                                      <CourseCard
                                          key={course.id}
                                          course={course}
                                          onViewDetails={handleViewCourse}
                                      />
                                  )
                              )}
                          </div>
                      )}
                  </div>
              </TabsContent>
          </Tabs>
      </div>
  );
}
