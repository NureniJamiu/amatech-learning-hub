/**
 * Prefetching utilities for React Query optimization
 */

import { QueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { courseKeys } from "@/hooks/use-courses";
import { materialKeys } from "@/hooks/use-materials";
import { pastQuestionKeys } from "@/hooks/use-past-questions";
import { authKeys } from "@/hooks/use-auth";
import type { Course, Material, Material2, PastQuestion, User } from "@/types";

/**
 * Prefetch user's level courses when user data is available
 */
export const prefetchUserCourses = async (queryClient: QueryClient, user: User) => {
    if (!user.level) return;

    // Prefetch courses for user's level
    await queryClient.prefetchQuery({
        queryKey: courseKeys.userLevel(user.level),
        queryFn: () =>
            apiClient.get<{ courses: Course[]; total: number }>("/courses", {
                params: { level: user.level, limit: 100 },
            }),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });

    // Prefetch courses for user's current semester
    if (user.currentSemester) {
        await queryClient.prefetchQuery({
            queryKey: courseKeys.userLevelSemester(user.level, user.currentSemester),
            queryFn: () =>
                apiClient.get<{ courses: Course[]; total: number }>("/courses", {
                    params: { level: user.level, semester: user.currentSemester, limit: 50 },
                }),
            staleTime: 1000 * 60 * 15, // 15 minutes
        });
    }
};

/**
 * Prefetch course materials when a course is selected
 */
export const prefetchCourseMaterials = async (queryClient: QueryClient, courseId: string) => {
    if (!courseId) return;

    await queryClient.prefetchQuery({
        queryKey: materialKeys.byCourse(courseId),
        queryFn: () => apiClient.get<Material[]>(`/courses/${courseId}/materials`),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Prefetch course past questions when a course is selected
 */
export const prefetchCoursePastQuestions = async (queryClient: QueryClient, courseId: string) => {
    if (!courseId) return;

    await queryClient.prefetchQuery({
        queryKey: pastQuestionKeys.byCourse(courseId),
        queryFn: () => apiClient.get<PastQuestion[]>(`/courses/${courseId}/past-questions`),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Prefetch user's timetable data
 */
export const prefetchUserTimetable = async (queryClient: QueryClient) => {
    await queryClient.prefetchQuery({
        queryKey: ["timetable", "user", "current"],
        queryFn: () => apiClient.get("/timetable"),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

/**
 * Prefetch recent materials and past questions for analytics
 */
export const prefetchRecentContent = async (queryClient: QueryClient) => {
    // Prefetch recent materials
    await queryClient.prefetchQuery({
        queryKey: materialKeys.list({ limit: 10 }),
        queryFn: () =>
            apiClient.get<{ materials: Material2[]; total: number }>("/materials", {
                params: { limit: 10 },
            }),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Prefetch recent past questions
    await queryClient.prefetchQuery({
        queryKey: pastQuestionKeys.list({ limit: 10 }),
        queryFn: () =>
            apiClient.get<{ pastQuestions: PastQuestion[]; total: number }>("/past-questions", {
                params: { limit: 10 },
            }),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Warm up the cache with essential data after user login
 */
export const warmUpCache = async (queryClient: QueryClient, user: User) => {
    try {
        // Run prefetching in parallel for better performance
        await Promise.allSettled([
            prefetchUserCourses(queryClient, user),
            prefetchUserTimetable(queryClient),
            prefetchRecentContent(queryClient),
        ]);
    } catch (error) {
        console.warn("Cache warm-up failed:", error);
        // Don't throw - prefetching failures shouldn't block the app
    }
};

/**
 * Invalidate related queries when user data changes
 */
export const invalidateUserQueries = (queryClient: QueryClient, oldLevel?: number, newLevel?: number) => {
    // Invalidate auth queries
    queryClient.invalidateQueries({ queryKey: authKeys.user });
    
    // Invalidate old level queries if level changed
    if (oldLevel && oldLevel !== newLevel) {
        queryClient.invalidateQueries({ queryKey: courseKeys.userLevel(oldLevel) });
    }
    
    // Invalidate new level queries
    if (newLevel) {
        queryClient.invalidateQueries({ queryKey: courseKeys.userLevel(newLevel) });
    }
    
    // Invalidate timetable
    queryClient.invalidateQueries({ queryKey: ["timetable"] });
};
