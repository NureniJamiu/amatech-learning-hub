"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect, useMemo } from "react";

import { useCurrentUser } from "@/hooks/use-auth";
import { useCourses } from "@/hooks/use-courses";
import type { Course } from "@/types";

type AppView = "dashboard" | "courses" | "timetable" | "ai-assistant";

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
    currentUser: any;
    activeAdminSection: string;
    setActiveAdminSection: (section: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [currentView, setCurrentView] = useState<AppView>("dashboard");
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [activeAdminSection, setActiveAdminSection] = useState("users");

    // Get current user from authentication
    const { data: currentUser, isLoading: userLoading } = useCurrentUser();

    // Get courses data
    const { data: coursesResponse, isLoading: coursesLoading } = useCourses({
        limit: 1000,
    });

    // Initialize filters based on user level when user data is available
    const [filterLevel, setFilterLevel] = useState<number>(1);
    const [filterSemester, setFilterSemester] = useState<1 | 2>(1);

    // Update filters when user data is loaded (only once)
    useEffect(() => {
        if (currentUser && !userLoading) {
            setFilterLevel(currentUser.level || 1);
            setFilterSemester(currentUser.currentSemester || 1);
        }
    }, [currentUser, userLoading]);

    // Get all available levels from courses
    const availableLevels = useMemo(() => {
        // Always show all levels from 100 to 500, regardless of available courses
        return [100, 200, 300, 400, 500];
    }, []);

    // Filter courses based on level and semester
    const filteredCourses = useMemo(() => {
        if (!coursesResponse?.courses) {
            return [];
        }

        const filtered = coursesResponse.courses.filter((course) => {
            return (
                course.level === filterLevel &&
                course.semester === filterSemester
            );
        });

        return filtered;
    }, [coursesResponse?.courses, filterLevel, filterSemester]);

    // Show loading state while data is being fetched
    if (userLoading || coursesLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

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
                activeAdminSection,
                setActiveAdminSection,
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
