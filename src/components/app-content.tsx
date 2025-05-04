"use client";

import { useAppContext } from "@/context/app-context";
import { AIAssistantView } from "@/components/ai-assistant-view";
import { CourseContent } from "@/components/course-content";
import { DashboardView } from "@/components/dashboard-view";

export function AppContent() {
  const { currentView } = useAppContext();

  return (
    <div className="flex-1">
      {currentView === "dashboard" && <DashboardView />}
      {currentView === "courses" && <CourseContent />}
      {currentView === "ai-assistant" && <AIAssistantView />}
    </div>
  );
}
