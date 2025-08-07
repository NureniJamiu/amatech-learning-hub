"use client";

import { useAppContext } from "@/context/app-context";
import { AdminContent } from "@/components/admin/admin-content";
import { AIAssistantView } from "@/components/ai-assistant-view";
import { CourseContent } from "@/components/course-content";
import { CoursesView } from "@/components/courses-view";
import { DashboardView } from "@/components/dashboard-view";
import { TimetableView } from "@/components/timetable-view";

export function AppContent() {
    const { currentView, isAdminMode, selectedCourse } = useAppContext();

    // If in admin mode, show admin content
    if (isAdminMode) {
        return <AdminContent />;
    }

    // Otherwise show regular student content
    return (
        <div className="flex-1">
            {currentView === "dashboard" && <DashboardView />}
            {currentView === "courses" && selectedCourse && <CourseContent />}
            {currentView === "courses" && !selectedCourse && <CoursesView />}
            {currentView === "timetable" && <TimetableView />}
            {currentView === "ai-assistant" && <AIAssistantView />}
        </div>
    );
}
