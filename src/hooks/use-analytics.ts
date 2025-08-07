"use client";

import { useQuery } from "@tanstack/react-query";
import { useCourses } from "@/hooks/use-courses";
import { useMaterials } from "@/hooks/use-materials";
import { usePastQuestions } from "@/hooks/use-past-questions";
import { useTutors } from "@/hooks/use-tutors";

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

// Hook to get analytics overview
export function useAnalyticsOverview() {
    const { data: coursesResponse } = useCourses({ limit: 1000 });
    const { data: materialsResponse } = useMaterials({ limit: 1000 });
    const { data: pastQuestionsResponse } = usePastQuestions({ limit: 1000 });
    const { data: tutorsResponse } = useTutors({ limit: 1000 });

    return useQuery({
        queryKey: analyticsKeys.overview(),
        queryFn: () => {
            const courses = coursesResponse?.courses || [];
            const materials = materialsResponse?.materials || [];
            const pastQuestions = pastQuestionsResponse?.pastQuestions || [];
            const tutors = tutorsResponse?.tutors || [];

            const totalCourses = courses.length;
            const totalMaterials = materials.length;
            const totalPastQuestions = pastQuestions.length;
            const totalTutors = tutors.length;
            const totalContent = totalMaterials + totalPastQuestions;

            return {
                totalCourses,
                totalMaterials,
                totalPastQuestions,
                totalTutors,
                totalContent,
                averageMaterialsPerCourse:
                    totalCourses > 0
                        ? (totalMaterials / totalCourses).toFixed(1)
                        : "0",
                averagePastQuestionsPerCourse:
                    totalCourses > 0
                        ? (totalPastQuestions / totalCourses).toFixed(1)
                        : "0",
            } as AnalyticsOverview;
        },
        enabled: !!(
            coursesResponse &&
            materialsResponse &&
            pastQuestionsResponse &&
            tutorsResponse
        ),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}

// Hook to get course usage analytics
export function useCourseUsageAnalytics() {
    const { data: coursesResponse } = useCourses({ limit: 1000 });
    const { data: materialsResponse } = useMaterials({ limit: 1000 });
    const { data: pastQuestionsResponse } = usePastQuestions({ limit: 1000 });

    return useQuery({
        queryKey: analyticsKeys.courseUsage(),
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
                .sort((a, b) => b.totalContent - a.totalContent);

            return courseUsageData;
        },
        enabled: !!(
            coursesResponse &&
            materialsResponse &&
            pastQuestionsResponse
        ),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}

// Hook to get content distribution analytics
export function useContentDistributionAnalytics() {
    const { data: materialsResponse } = useMaterials({ limit: 1000 });
    const { data: pastQuestionsResponse } = usePastQuestions({ limit: 1000 });

    return useQuery({
        queryKey: analyticsKeys.contentDistribution(),
        queryFn: () => {
            const materials = materialsResponse?.materials || [];
            const pastQuestions = pastQuestionsResponse?.pastQuestions || [];

            const contentDistribution: ContentDistribution[] = [
                {
                    name: "Course Materials",
                    value: materials.length,
                    color: "bg-blue-500",
                },
                {
                    name: "Past Questions",
                    value: pastQuestions.length,
                    color: "bg-green-500",
                },
            ];

            return contentDistribution;
        },
        enabled: !!(materialsResponse && pastQuestionsResponse),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}

// Hook to get level distribution analytics
export function useLevelDistributionAnalytics() {
    const { data: coursesResponse } = useCourses({ limit: 1000 });

    return useQuery({
        queryKey: analyticsKeys.levelDistribution(),
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
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}

// Hook to get recent activity analytics
export function useRecentActivityAnalytics() {
    const { data: materialsResponse } = useMaterials({ limit: 10 });
    const { data: pastQuestionsResponse } = usePastQuestions({ limit: 10 });

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

            const recentPastQuestions = pastQuestions
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
                .slice(0, 5);

            return {
                recentMaterials,
                recentPastQuestions,
            };
        },
        enabled: !!(materialsResponse && pastQuestionsResponse),
        staleTime: 1000 * 60 * 2, // 2 minutes (more dynamic)
        gcTime: 1000 * 60 * 5, // 5 minutes
    });
}
