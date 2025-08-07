"use client";

import { useQuery } from "@tanstack/react-query";
import { useCourses, useUserLevelCourses } from "@/hooks/use-courses";
import { useMaterials } from "@/hooks/use-materials";
import { usePastQuestions } from "@/hooks/use-past-questions";
import { useTutors } from "@/hooks/use-tutors";
import { useCurrentUser } from "@/hooks/use-auth";

// Query keys for analytics
export const analyticsKeys = {
    all: ["analytics"] as const,
    overview: () => [...analyticsKeys.all, "overview"] as const,
    courseUsage: () => [...analyticsKeys.all, "courseUsage"] as const,
    contentDistribution: () =>
        [...analyticsKeys.all, "contentDistribution"] as const,
    levelDistribution: () =>
        [...analyticsKeys.all, "levelDistribution"] as const,
};

// Types for analytics data
export type AnalyticsOverview = {
    totalCourses: number;
    totalMaterials: number;
    totalPastQuestions: number;
    totalTutors: number;
    totalContent: number;
    averageMaterialsPerCourse: number;
    averagePastQuestionsPerCourse: number;
};

export type CourseUsageData = {
    course: string;
    courseTitle: string;
    materials: number;
    pastQuestions: number;
    totalContent: number;
    level: number;
    semester: number;
};

export type ContentDistribution = {
    name: string;
    value: number;
    color: string;
};

export type LevelDistribution = {
    level: number;
    count: number;
    percentage: number;
};

// Hook to get analytics overview (optimized)
export function useAnalyticsOverview() {
    // Use smaller, more focused queries instead of fetching everything
    const { data: coursesResponse } = useCourses({ limit: 50 }); // Reduced limit
    const { data: materialsResponse } = useMaterials({ limit: 50 }); // Reduced limit
    const { data: pastQuestionsResponse } = usePastQuestions({ limit: 50 }); // Reduced limit
    const { data: tutorsResponse } = useTutors({ limit: 50 }); // Reduced limit

    return useQuery({
        queryKey: analyticsKeys.overview(),
        queryFn: () => {
            const courses = coursesResponse?.courses || [];
            const materials = materialsResponse?.materials || [];
            const pastQuestions = pastQuestionsResponse?.pastQuestions || [];
            const tutors = tutorsResponse?.tutors || [];

            const totalCourses = coursesResponse?.total || courses.length;
            const totalMaterials = materialsResponse?.total || materials.length;
            const totalPastQuestions = pastQuestionsResponse?.total || pastQuestions.length;
            const totalTutors = tutorsResponse?.total || tutors.length;
            const totalContent = totalMaterials + totalPastQuestions;

            return {
                totalCourses,
                totalMaterials,
                totalPastQuestions,
                totalTutors,
                totalContent,
                averageMaterialsPerCourse:
                    totalCourses > 0
                        ? parseFloat((totalMaterials / totalCourses).toFixed(1))
                        : 0,
                averagePastQuestionsPerCourse:
                    totalCourses > 0
                        ? parseFloat((totalPastQuestions / totalCourses).toFixed(1))
                        : 0,
            } as AnalyticsOverview;
        },
        enabled: !!(
            coursesResponse &&
            materialsResponse &&
            pastQuestionsResponse &&
            tutorsResponse
        ),
        staleTime: 1000 * 60 * 10, // 10 minutes (analytics don't need to be real-time)
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
}

// Hook to get course usage analytics (user-specific and optimized)
export function useCourseUsageAnalytics() {
    const { data: currentUser } = useCurrentUser();
    
    // Only fetch courses for the user's level to reduce data
    const { data: coursesResponse } = useUserLevelCourses(
        currentUser?.level || 0,
        !!currentUser?.level
    );
    const { data: materialsResponse } = useMaterials({ limit: 50 });
    const { data: pastQuestionsResponse } = usePastQuestions({ limit: 50 });

    return useQuery({
        queryKey: [...analyticsKeys.courseUsage(), currentUser?.level],
        queryFn: () => {
            const courses = coursesResponse?.courses || [];
            const materials = materialsResponse?.materials || [];
            const pastQuestions = pastQuestionsResponse?.pastQuestions || [];

            const courseUsageData = courses
                .map((course) => {
                    const courseMaterials = materials.filter(
                        (material) => material.course?.code === course.code
                    );
                    const coursePastQuestions = pastQuestions.filter(
                        (pq) => pq.course?.code === course.code
                    );

                    return {
                        course: course.code,
                        courseTitle: course.title,
                        materials: courseMaterials.length,
                        pastQuestions: coursePastQuestions.length,
                        totalContent:
                            courseMaterials.length + coursePastQuestions.length,
                        level: course.level,
                        semester: course.semester,
                    } as CourseUsageData;
                })
                .sort((a, b) => b.totalContent - a.totalContent)
                .slice(0, 20); // Limit results for performance

            return courseUsageData;
        },
        enabled: !!(
            currentUser?.level &&
            coursesResponse &&
            materialsResponse &&
            pastQuestionsResponse
        ),
        staleTime: 1000 * 60 * 10, // 10 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
}

// Hook to get content distribution analytics (optimized)
export function useContentDistributionAnalytics() {
    const { data: materialsResponse } = useMaterials({ limit: 50 });
    const { data: pastQuestionsResponse } = usePastQuestions({ limit: 50 });

    return useQuery({
        queryKey: analyticsKeys.contentDistribution(),
        queryFn: () => {
            // Use total counts from response if available, otherwise use array length
            const materialCount = materialsResponse?.total || materialsResponse?.materials?.length || 0;
            const pastQuestionCount = pastQuestionsResponse?.total || pastQuestionsResponse?.pastQuestions?.length || 0;

            const contentDistribution: ContentDistribution[] = [
                {
                    name: "Course Materials",
                    value: materialCount,
                    color: "bg-blue-500",
                },
                {
                    name: "Past Questions",
                    value: pastQuestionCount,
                    color: "bg-green-500",
                },
            ];

            return contentDistribution;
        },
        enabled: !!(materialsResponse && pastQuestionsResponse),
        staleTime: 1000 * 60 * 10, // 10 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
}

// Hook to get level distribution analytics (user-aware and optimized)
export function useLevelDistributionAnalytics() {
    const { data: currentUser } = useCurrentUser();
    
    // Focus on user's level and nearby levels for more relevant analytics
    const levelRange = currentUser?.level ? [
        currentUser.level - 1,
        currentUser.level,
        currentUser.level + 1
    ].filter(level => level > 0 && level <= 5) : [1, 2, 3, 4, 5];

    const { data: coursesResponse } = useCourses({ limit: 100 }); // Still reasonable limit

    return useQuery({
        queryKey: [...analyticsKeys.levelDistribution(), levelRange],
        queryFn: () => {
            const courses = coursesResponse?.courses || [];

            const levelCount = courses.reduce((acc, course) => {
                acc[course.level] = (acc[course.level] || 0) + 1;
                return acc;
            }, {} as Record<number, number>);

            const totalCourses = courses.length;

            const levelDistribution: LevelDistribution[] = Object.entries(
                levelCount
            )
                .map(([level, count]) => ({
                    level: parseInt(level),
                    count,
                    percentage:
                        totalCourses > 0
                            ? Math.round((count / totalCourses) * 100)
                            : 0,
                }))
                .sort((a, b) => a.level - b.level);

            return levelDistribution;
        },
        enabled: !!coursesResponse,
        staleTime: 1000 * 60 * 15, // 15 minutes (very stable data)
        gcTime: 1000 * 60 * 60, // 1 hour
    });
}

// Hook to get recent activity analytics (optimized)
export function useRecentActivityAnalytics() {
    const { data: materialsResponse } = useMaterials({ limit: 10 }); // Already limited
    const { data: pastQuestionsResponse } = usePastQuestions({ limit: 10 }); // Already limited

    return useQuery({
        queryKey: [...analyticsKeys.all, "recentActivity"],
        queryFn: () => {
            const materials = materialsResponse?.materials || [];
            const pastQuestions = pastQuestionsResponse?.pastQuestions || [];

            const recentMaterials = materials
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
                .slice(0, 5);

            // Since PastQuestion doesn't have createdAt, just take the first 5
            const recentPastQuestions = pastQuestions.slice(0, 5);

            return {
                recentMaterials,
                recentPastQuestions,
            };
        },
        enabled: !!(materialsResponse && pastQuestionsResponse),
        staleTime: 1000 * 60 * 5, // 5 minutes (more dynamic for recent activity)
        gcTime: 1000 * 60 * 15, // 15 minutes
    });
}
