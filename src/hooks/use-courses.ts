import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { Course } from "@/types";

// Query keys for React Query
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: CourseFilters) => [...courseKeys.lists(), filters] as const,
  infinite: (filters: Omit<CourseFilters, 'page'>) => [...courseKeys.lists(), "infinite", filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  userLevel: (level: number) => [...courseKeys.all, "userLevel", level] as const,
  userLevelSemester: (level: number, semester: number) => [...courseKeys.all, "userLevel", level, "semester", semester] as const,
};

// Types
export type CourseFilters = {
  level?: number;
  semester?: number;
  search?: string;
  page?: number;
  limit?: number;
};

export type CourseInput = {
  code: string;
  title: string;
  units: number;
  level: number;
  semester: number;
  description: string;
  tutorIds?: string[];
};

// Hook to fetch courses with filters (optimized)
export function useCourses(filters: CourseFilters = {}) {
    // Set reasonable default limit
    const optimizedFilters = {
        limit: 20, // Reduced from potentially 1000
        ...filters,
    };

    return useQuery({
        queryKey: courseKeys.list(optimizedFilters),
        queryFn: () =>
            apiClient.get<{ courses: Course[]; total: number }>("/courses", {
                params: optimizedFilters,
            }),
        staleTime: 1000 * 60 * 5, // 5 minutes for course lists
        gcTime: 1000 * 60 * 15, // 15 minutes in cache
        // Enable background updates for better UX
        refetchInterval: false, // No automatic polling
        // Enable optimistic updates
        placeholderData: (previousData) => previousData, // Keep previous data while loading
    });
}

// Hook to fetch infinite courses (for large lists)
export function useInfiniteCourses(filters: Omit<CourseFilters, 'page'> = {}) {
    const optimizedFilters = {
        limit: 20,
        ...filters,
    };

    return useInfiniteQuery({
        queryKey: courseKeys.infinite(optimizedFilters),
        queryFn: ({ pageParam = 1 }) =>
            apiClient.get<{ courses: Course[]; total: number; page: number; totalPages: number }>("/courses", {
                params: { ...optimizedFilters, page: pageParam },
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 15, // 15 minutes
    });
}

// Optimized hook for user's level courses (commonly used)
export function useUserLevelCourses(level: number, enabled = true) {
    return useQuery({
        queryKey: courseKeys.userLevel(level),
        queryFn: () =>
            apiClient.get<{ courses: Course[]; total: number }>("/courses", {
                params: { level, limit: 100 }, // Reasonable limit for user's level
            }),
        enabled: enabled && !!level,
        staleTime: 1000 * 60 * 10, // 10 minutes (less dynamic)
        gcTime: 1000 * 60 * 30, // 30 minutes in cache (longer for user-specific data)
        placeholderData: (previousData) => previousData,
    });
}

// Optimized hook for user's level and semester courses
export function useUserLevelSemesterCourses(level: number, semester: number, enabled = true) {
    return useQuery({
        queryKey: courseKeys.userLevelSemester(level, semester),
        queryFn: () =>
            apiClient.get<{ courses: Course[]; total: number }>("/courses", {
                params: { level, semester, limit: 50 }, // Even more specific limit
            }),
        enabled: enabled && !!level && !!semester,
        staleTime: 1000 * 60 * 15, // 15 minutes (even more stable)
        gcTime: 1000 * 60 * 60, // 1 hour in cache
        placeholderData: (previousData) => previousData,
    });
}

// Hook to fetch a single course by ID
export function useCourse(id: string) {
    return useQuery({
        queryKey: courseKeys.detail(id),
        queryFn: () => apiClient.get<Course>(`/courses/${id}`),
        enabled: !!id, // Only run if ID is provided
        staleTime: 1000 * 60 * 15, // 15 minutes for individual courses (more stable)
        gcTime: 1000 * 60 * 30, // 30 minutes in cache
        placeholderData: (previousData) => previousData,
    });
}

// Hook to create a new course
export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseData: CourseInput) =>
            apiClient.post<Course>("/courses", courseData),
        onMutate: async (newCourse) => {
            // Cancel any outgoing refetches for related queries
            await queryClient.cancelQueries({ queryKey: courseKeys.lists() });
            await queryClient.cancelQueries({ queryKey: courseKeys.userLevel(newCourse.level) });
            await queryClient.cancelQueries({ queryKey: courseKeys.userLevelSemester(newCourse.level, newCourse.semester) });

            // Snapshot the previous values
            const previousCourses = queryClient.getQueryData(courseKeys.lists());
            const previousUserLevelCourses = queryClient.getQueryData(courseKeys.userLevel(newCourse.level));
            const previousUserLevelSemesterCourses = queryClient.getQueryData(courseKeys.userLevelSemester(newCourse.level, newCourse.semester));

            // Optimistically update multiple related queries
            const optimisticCourse = { ...newCourse, id: "temp-id" } as Course;

            // Update general course lists
            queryClient.setQueriesData(
                { queryKey: courseKeys.lists() },
                (old: { courses: Course[]; total: number } | undefined) => {
                    if (!old) return { courses: [], total: 0 };
                    return {
                        courses: [...old.courses, optimisticCourse],
                        total: old.total + 1,
                    };
                }
            );

            // Update user level courses
            queryClient.setQueryData(
                courseKeys.userLevel(newCourse.level),
                (old: { courses: Course[]; total: number } | undefined) => {
                    if (!old) return { courses: [optimisticCourse], total: 1 };
                    return {
                        courses: [...old.courses, optimisticCourse],
                        total: old.total + 1,
                    };
                }
            );

            // Update user level + semester courses
            queryClient.setQueryData(
                courseKeys.userLevelSemester(newCourse.level, newCourse.semester),
                (old: { courses: Course[]; total: number } | undefined) => {
                    if (!old) return { courses: [optimisticCourse], total: 1 };
                    return {
                        courses: [...old.courses, optimisticCourse],
                        total: old.total + 1,
                    };
                }
            );

            return { previousCourses, previousUserLevelCourses, previousUserLevelSemesterCourses };
        },
        onError: (err, newCourse, context) => {
            // Rollback optimistic updates
            if (context?.previousCourses) {
                queryClient.setQueriesData({ queryKey: courseKeys.lists() }, context.previousCourses);
            }
            if (context?.previousUserLevelCourses) {
                queryClient.setQueryData(courseKeys.userLevel(newCourse.level), context.previousUserLevelCourses);
            }
            if (context?.previousUserLevelSemesterCourses) {
                queryClient.setQueryData(courseKeys.userLevelSemester(newCourse.level, newCourse.semester), context.previousUserLevelSemesterCourses);
            }
            showApiError(err);
        },
        onSettled: (data, error, variables) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
            queryClient.invalidateQueries({ queryKey: courseKeys.userLevel(variables.level) });
            queryClient.invalidateQueries({ queryKey: courseKeys.userLevelSemester(variables.level, variables.semester) });
            // Also invalidate infinite queries
            queryClient.invalidateQueries({ queryKey: courseKeys.infinite({}) });
        },
    });
}

// Hook to update an existing course (optimized)
export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: Partial<CourseInput>;
        }) => apiClient.put<Course>(`/courses/${id}`, data),
        onMutate: async ({ id, data }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: courseKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: courseKeys.lists() });

            // Snapshot the previous values
            const previousCourse = queryClient.getQueryData(courseKeys.detail(id));

            // Optimistically update the course detail
            queryClient.setQueryData(
                courseKeys.detail(id),
                (old: Course | undefined) => {
                    if (!old) return undefined;
                    return { ...old, ...data };
                }
            );

            // Optimistically update in all list queries
            queryClient.setQueriesData(
                { queryKey: courseKeys.lists() },
                (old: { courses: Course[]; total: number } | undefined) => {
                    if (!old) return old;
                    return {
                        ...old,
                        courses: old.courses.map((course) =>
                            course.id === id ? { ...course, ...data } : course
                        ),
                    };
                }
            );

            return { previousCourse };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousCourse) {
                queryClient.setQueryData(courseKeys.detail(variables.id), context.previousCourse);
            }
            showApiError(err);
        },
        onSettled: (data, error, variables) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
            if (data) {
                queryClient.invalidateQueries({ queryKey: courseKeys.userLevel(data.level) });
                queryClient.invalidateQueries({ queryKey: courseKeys.userLevelSemester(data.level, data.semester) });
            }
        },
    });
}

// Hook to delete a course (optimized)
export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.delete<void>(`/courses/${id}`),
        onMutate: async (id) => {
            // Get the course data before deletion for optimistic updates
            const courseToDelete = queryClient.getQueryData<Course>(
                courseKeys.detail(id)
            );

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: courseKeys.lists() });

            // Snapshot the previous value
            const previousCourses = queryClient.getQueryData(
                courseKeys.lists()
            );

            // Optimistically remove the course from all list queries
            queryClient.setQueriesData(
                { queryKey: courseKeys.lists() },
                (old: { courses: Course[]; total: number } | undefined) => {
                    if (!old) return old;
                    return {
                        courses: old.courses.filter(
                            (course) => course.id !== id
                        ),
                        total: old.total - 1,
                    };
                }
            );

            // Also update level-specific queries if we know the course data
            if (courseToDelete) {
                queryClient.setQueryData(
                    courseKeys.userLevel(courseToDelete.level),
                    (old: { courses: Course[]; total: number } | undefined) => {
                        if (!old) return old;
                        return {
                            courses: old.courses.filter(
                                (course) => course.id !== id
                            ),
                            total: old.total - 1,
                        };
                    }
                );

                queryClient.setQueryData(
                    courseKeys.userLevelSemester(
                        courseToDelete.level,
                        courseToDelete.semester
                    ),
                    (old: { courses: Course[]; total: number } | undefined) => {
                        if (!old) return old;
                        return {
                            courses: old.courses.filter(
                                (course) => course.id !== id
                            ),
                            total: old.total - 1,
                        };
                    }
                );
            }

            return { previousCourses, courseToDelete };
        },
        onError: (err, id, context) => {
            // Rollback on error
            if (context?.previousCourses) {
                queryClient.setQueriesData(
                    { queryKey: courseKeys.lists() },
                    context.previousCourses
                );
            }
            showApiError(err);
        },
        onSettled: (data, error, id, context) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });

            // Remove the individual course from cache
            queryClient.removeQueries({ queryKey: courseKeys.detail(id) });

            // Invalidate level-specific queries if we know the course
            if (context?.courseToDelete) {
                queryClient.invalidateQueries({
                    queryKey: courseKeys.userLevel(
                        context.courseToDelete.level
                    ),
                });
                queryClient.invalidateQueries({
                    queryKey: courseKeys.userLevelSemester(
                        context.courseToDelete.level,
                        context.courseToDelete.semester
                    ),
                });
            }
        },
    });
}

// Hook to assign tutors to a course
export function useAssignTutors() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            courseId,
            tutorIds,
        }: {
            courseId: string;
            tutorIds: string[];
        }) =>
            apiClient.post<Course>(`/courses/${courseId}/tutors`, { tutorIds }),
        onSuccess: (data, variables) => {
            // Update the specific course in cache
            queryClient.setQueryData(
                courseKeys.detail(variables.courseId),
                data
            );

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: courseKeys.userLevel(data.level),
            });
            queryClient.invalidateQueries({
                queryKey: courseKeys.userLevelSemester(
                    data.level,
                    data.semester
                ),
            });
        },
        onError: (error) => {
            showApiError(error);
        },
    });
}
