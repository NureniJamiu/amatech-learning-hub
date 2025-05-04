"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";

import { courses, currentUser } from "@/data/mock-data";
import type { Course } from "@/types";

type CourseContextType = {
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  filteredCourses: Course[];
  filterLevel: number;
  setFilterLevel: (level: number) => void;
  filterSemester: 1 | 2;
  setFilterSemester: (semester: 1 | 2) => void;
  availableLevels: number[];
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filterLevel, setFilterLevel] = useState<number>(currentUser.level);
  const [filterSemester, setFilterSemester] = useState<1 | 2>(
    currentUser.currentSemester
  );

  // Get all available levels from courses
  const availableLevels = [
    ...new Set(courses.map((course) => course.level)),
  ].sort();

  // Filter courses based on level and semester
  const filteredCourses = courses.filter(
    (course) =>
      course.level === filterLevel && course.semester === filterSemester
  );

  // Set the first course as selected by default when filtered courses change
  useEffect(() => {
    if (filteredCourses.length > 0 && !selectedCourse) {
      setSelectedCourse(filteredCourses[0]);
    } else if (
      filteredCourses.length > 0 &&
      !filteredCourses.some((c) => c.id === selectedCourse?.id)
    ) {
      // If the selected course is not in the filtered list, select the first one
      setSelectedCourse(filteredCourses[0]);
    }
  }, [filteredCourses, selectedCourse]);

  return (
    <CourseContext.Provider
      value={{
        selectedCourse,
        setSelectedCourse,
        filteredCourses,
        filterLevel,
        setFilterLevel,
        filterSemester,
        setFilterSemester,
        availableLevels,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourseContext() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
}
