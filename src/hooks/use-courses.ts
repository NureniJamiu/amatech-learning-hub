import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { Course } from "@/types";

// Query keys for React Query
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: CourseFilters) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
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

// Hook to fetch courses with filters
export function useCourses(filters: CourseFilters = {}) {
    return useQuery({
        queryKey: courseKeys.list(filters),
        queryFn: () =>
            apiClient.get<{ courses: Course[]; total: number }>("/courses", {
                params: filters,
            }),
        staleTime: 1000 * 60 * 2, // 2 minutes for course lists (more dynamic)
        gcTime: 1000 * 60 * 5, // 5 minutes in cache
    });
}

// Hook to fetch a single course by ID
export function useCourse(id: string) {
    return useQuery({
        queryKey: courseKeys.detail(id),
        queryFn: () => apiClient.get<Course>(`/courses/${id}`),
        enabled: !!id, // Only run if ID is provided
        staleTime: 1000 * 60 * 10, // 10 minutes for individual courses (less dynamic)
        gcTime: 1000 * 60 * 15, // 15 minutes in cache
    });
}

// Hook to create a new course
export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseData: CourseInput) =>
            apiClient.post<Course>("/courses", courseData),
        onMutate: async (newCourse) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: courseKeys.lists() });

            // Snapshot the previous value
            const previousCourses = queryClient.getQueryData(
                courseKeys.lists()
            );

            // Optimistically update to the new value
            queryClient.setQueryData(
                courseKeys.lists(),
                (old: { courses: Course[]; total: number } | undefined) => {
                    if (!old) return { courses: [], total: 0 };
                    return {
                        courses: [
                            ...old.courses,
                            { ...newCourse, id: "temp-id" } as Course,
                        ],
                        total: old.total + 1,
                    };
                }
            );

            // Return a context object with the snapshotted value
            return { previousCourses };
        },
        onError: (err, newCourse, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousCourses) {
                queryClient.setQueryData(
                    courseKeys.lists(),
                    context.previousCourses
                );
            }
            showApiError(err);
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
        },
    });
}

// Hook to update an existing course
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
            await queryClient.cancelQueries({
                queryKey: courseKeys.detail(id),
            });
            await queryClient.cancelQueries({ queryKey: courseKeys.lists() });

            // Snapshot the previous values
            const previousCourse = queryClient.getQueryData(
                courseKeys.detail(id)
            );
            const previousCourses = queryClient.getQueryData(
                courseKeys.lists()
            );

            // Optimistically update the course detail
            queryClient.setQueryData(
                courseKeys.detail(id),
                (old: Course | undefined) => {
                    if (!old) return undefined;
                    return { ...old, ...data };
                }
            );

            // Optimistically update the course in lists
            queryClient.setQueryData(
                courseKeys.lists(),
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

            return { previousCourse, previousCourses };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousCourse) {
                queryClient.setQueryData(
                    courseKeys.detail(variables.id),
                    context.previousCourse
                );
            }
            if (context?.previousCourses) {
                queryClient.setQueryData(
                    courseKeys.lists(),
                    context.previousCourses
                );
            }
            showApiError(err);
        },
        onSettled: (data, error, variables) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({
                queryKey: courseKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
        },
    });
}

// Hook to delete a course
export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.delete<void>(`/courses/${id}`),
        onMutate: async (id) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: courseKeys.lists() });

            // Snapshot the previous value
            const previousCourses = queryClient.getQueryData(
                courseKeys.lists()
            );

            // Optimistically remove the course from lists
            queryClient.setQueryData(
                courseKeys.lists(),
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

            return { previousCourses };
        },
        onError: (err, id, context) => {
            // Rollback on error
            if (context?.previousCourses) {
                queryClient.setQueryData(
                    courseKeys.lists(),
                    context.previousCourses
                );
            }
            showApiError(err);
        },
        onSettled: (data, error, id) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
            // Remove the individual course from cache
            queryClient.removeQueries({ queryKey: courseKeys.detail(id) });
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
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: courseKeys.detail(variables.courseId),
            });
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
        },
        onError: (error) => {
            showApiError(error);
        },
    });
}
