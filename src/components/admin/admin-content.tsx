"use client";

import { useAppContext } from "@/context/app-context";
import { UserManagement } from "@/components/admin/user-management";
import { CourseManagement } from "@/components/admin/course-management";
import { ContentManagement } from "@/components/admin/content-management";
import { Analytics } from "@/components/admin/analytics";
import { SystemSettings } from "@/components/admin/system-settings";
import { Permissions } from "@/components/admin/permissions";
import { TutorManagement } from "@/components/admin/tutor-management";
// import { CourseCacheTest } from "../course-cache-test";

export function AdminContent() {
  const { activeAdminSection } = useAppContext();

  return (
    <div className="space-y-6">
      {activeAdminSection === "users" && <UserManagement />}
      {activeAdminSection === "courses" && <CourseManagement />}
      {/* {activeAdminSection === "courses" && <CourseCacheTest />} */}
      {activeAdminSection === "content" && <ContentManagement />}
      {activeAdminSection === "tutors" && <TutorManagement />}
      {activeAdminSection === "analytics" && <Analytics />}
      {activeAdminSection === "settings" && <SystemSettings />}
      {activeAdminSection === "permissions" && <Permissions />}
    </div>
  );
}
