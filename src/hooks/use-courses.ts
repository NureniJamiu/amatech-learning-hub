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
  });
}

// Hook to fetch a single course by ID
export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => apiClient.get<Course>(`/courses/${id}`),
    enabled: !!id, // Only run if ID is provided
  });
}

// Hook to create a new course
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData: CourseInput) =>
      apiClient.post<Course>("/courses", courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

// Hook to update an existing course
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CourseInput> }) =>
      apiClient.put<Course>(`/courses/${id}`, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

// Hook to delete a course
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/courses/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.removeQueries({ queryKey: courseKeys.detail(id) });
    },
    onError: (error) => {
      showApiError(error);
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
    }) => apiClient.post<Course>(`/courses/${courseId}/tutors`, { tutorIds }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.courseId),
      });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}
