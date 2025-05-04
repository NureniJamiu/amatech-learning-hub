"use client";

import type React from "react";

import { createContext, useContext, useState } from "react";

import { courses, currentUser } from "@/data/mock-data";
import type { Course } from "@/types";

type AppView = "dashboard" | "courses" | "ai-assistant";

type AppContextType = {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  filteredCourses: Course[];
  filterLevel: number;
  setFilterLevel: (level: number) => void;
  filterSemester: 1 | 2;
  setFilterSemester: (semester: 1 | 2) => void;
  availableLevels: number[];
  isAdminMode: boolean;
  setIsAdminMode: (isAdmin: boolean) => void;
  currentUser: typeof currentUser;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filterLevel, setFilterLevel] = useState<number>(currentUser.level);
  const [filterSemester, setFilterSemester] = useState<1 | 2>(
    currentUser.currentSemester
  );
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Get all available levels from courses
  const availableLevels = [
    ...new Set(courses.map((course) => course.level)),
  ].sort();

  // Filter courses based on level and semester
  const filteredCourses = courses.filter(
    (course) =>
      course.level === filterLevel && course.semester === filterSemester
  );

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCourse,
        setSelectedCourse,
        filteredCourses,
        filterLevel,
        setFilterLevel,
        filterSemester,
        setFilterSemester,
        availableLevels,
        isAdminMode,
        setIsAdminMode,
        currentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
