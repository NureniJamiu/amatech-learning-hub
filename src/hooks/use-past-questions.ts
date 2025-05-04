import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { PastQuestion } from "@/types";

// Query keys for React Query
export const pastQuestionKeys = {
  all: ["pastQuestions"] as const,
  lists: () => [...pastQuestionKeys.all, "list"] as const,
  list: (filters: PastQuestionFilters) =>
    [...pastQuestionKeys.lists(), filters] as const,
  details: () => [...pastQuestionKeys.all, "detail"] as const,
  detail: (id: string) => [...pastQuestionKeys.details(), id] as const,
  byCourse: (courseId: string) =>
    [...pastQuestionKeys.all, "course", courseId] as const,
};

// Types
export type PastQuestionFilters = {
  courseId?: string;
  year?: number;
  search?: string;
  page?: number;
  limit?: number;
};

export type PastQuestionInput = {
  title: string;
  courseId: string;
  year: number;
  file: File;
};

// Hook to fetch past questions with filters
export function usePastQuestions(filters: PastQuestionFilters = {}) {
  return useQuery({
    queryKey: pastQuestionKeys.list(filters),
    queryFn: () =>
      apiClient.get<{ pastQuestions: PastQuestion[]; total: number }>(
        "/past-questions",
        { params: filters }
      ),
  });
}

// Hook to fetch past questions for a specific course
export function useCoursePastQuestions(courseId: string) {
  return useQuery({
    queryKey: pastQuestionKeys.byCourse(courseId),
    queryFn: () =>
      apiClient.get<PastQuestion[]>(`/courses/${courseId}/past-questions`),
    enabled: !!courseId, // Only run if courseId is provided
  });
}

// Hook to fetch a single past question by ID
export function usePastQuestion(id: string) {
  return useQuery({
    queryKey: pastQuestionKeys.detail(id),
    queryFn: () => apiClient.get<PastQuestion>(`/past-questions/${id}`),
    enabled: !!id, // Only run if ID is provided
  });
}

// Hook to upload a new past question
export function useUploadPastQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pastQuestionData: PastQuestionInput) => {
      const formData = new FormData();
      formData.append("title", pastQuestionData.title);
      formData.append("courseId", pastQuestionData.courseId);
      formData.append("year", pastQuestionData.year.toString());
      formData.append("file", pastQuestionData.file);

      // Use fetch directly for FormData
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "/api"}/past-questions`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pastQuestionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: pastQuestionKeys.byCourse(data.courseId),
      });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

// Hook to delete a past question
export function useDeletePastQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<PastQuestion>(`/past-questions/${id}`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pastQuestionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: pastQuestionKeys.lists(),
      });
      queryClient.removeQueries({ queryKey: pastQuestionKeys.detail(data.id) });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}
