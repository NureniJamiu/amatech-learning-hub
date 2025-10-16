-- Add performance indexes for optimized queries

-- User indexes
CREATE INDEX IF NOT EXISTS "users_level_idx" ON "users"("level");
CREATE INDEX IF NOT EXISTS "users_isAdmin_idx" ON "users"("isAdmin");
CREATE INDEX IF NOT EXISTS "users_currentSemester_idx" ON "users"("currentSemester");

-- Course indexes
CREATE INDEX IF NOT EXISTS "courses_level_semester_idx" ON "courses"("level", "semester");
CREATE INDEX IF NOT EXISTS "courses_level_idx" ON "courses"("level");
CREATE INDEX IF NOT EXISTS "courses_semester_idx" ON "courses"("semester");

-- Material indexes (some already exist)
CREATE INDEX IF NOT EXISTS "materials_courseId_processingStatus_idx" ON "materials"("courseId", "processingStatus");
CREATE INDEX IF NOT EXISTS "materials_uploadedById_idx" ON "materials"("uploadedById");
CREATE INDEX IF NOT EXISTS "materials_createdAt_idx" ON "materials"("createdAt" DESC);

-- MaterialChunk indexes (some already exist)
CREATE INDEX IF NOT EXISTS "material_chunks_materialId_chunkIndex_idx" ON "material_chunks"("materialId", "chunkIndex");

-- PastQuestion indexes
CREATE INDEX IF NOT EXISTS "past_questions_courseId_idx" ON "past_questions"("courseId");
CREATE INDEX IF NOT EXISTS "past_questions_year_idx" ON "past_questions"("year");
CREATE INDEX IF NOT EXISTS "past_questions_uploadedById_idx" ON "past_questions"("uploadedById");
CREATE INDEX IF NOT EXISTS "past_questions_createdAt_idx" ON "past_questions"("createdAt" DESC);

-- ChatSession indexes (some already exist)
CREATE INDEX IF NOT EXISTS "chat_sessions_userId_updatedAt_idx" ON "chat_sessions"("userId", "updatedAt" DESC);

-- ChatMessage indexes (some already exist)
CREATE INDEX IF NOT EXISTS "chat_messages_sessionId_createdAt_idx" ON "chat_messages"("sessionId", "createdAt" ASC);

-- TimetableEntry indexes
CREATE INDEX IF NOT EXISTS "timetable_entries_userId_semester_idx" ON "timetable_entries"("userId", "semester");
CREATE INDEX IF NOT EXISTS "timetable_entries_courseId_idx" ON "timetable_entries"("courseId");
CREATE INDEX IF NOT EXISTS "timetable_entries_day_idx" ON "timetable_entries"("day");

-- Bookmark indexes
CREATE INDEX IF NOT EXISTS "bookmarks_userId_createdAt_idx" ON "bookmarks"("userId", "createdAt" DESC);

-- Notification indexes
CREATE INDEX IF NOT EXISTS "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");
CREATE INDEX IF NOT EXISTS "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt" DESC);

-- Session indexes
CREATE INDEX IF NOT EXISTS "sessions_userId_idx" ON "sessions"("userId");
CREATE INDEX IF NOT EXISTS "sessions_expires_idx" ON "sessions"("expires");

-- ActivityLog indexes
CREATE INDEX IF NOT EXISTS "activity_logs_userId_createdAt_idx" ON "activity_logs"("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "activity_logs_action_idx" ON "activity_logs"("action");
CREATE INDEX IF NOT EXISTS "activity_logs_ipAddress_idx" ON "activity_logs"("ipAddress");

-- CourseToTutor indexes
CREATE INDEX IF NOT EXISTS "course_tutors_tutorId_idx" ON "course_tutors"("tutorId");
