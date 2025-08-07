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
    year?: number;
    file: string | null;
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
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Hook to fetch past questions for a specific course
export function useCoursePastQuestions(courseId: string) {
    return useQuery({
        queryKey: pastQuestionKeys.byCourse(courseId),
        queryFn: () =>
            apiClient.get<PastQuestion[]>(
                `/courses/${courseId}/past-questions`
            ),
        enabled: !!courseId, // Only run if courseId is provided
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}

// Hook to fetch a single past question by ID
export function usePastQuestion(id: string) {
    return useQuery({
        queryKey: pastQuestionKeys.detail(id),
        queryFn: () => apiClient.get<PastQuestion>(`/past-questions/${id}`),
        enabled: !!id, // Only run if ID is provided
        staleTime: 1000 * 60 * 10, // 10 minutes
        gcTime: 1000 * 60 * 15, // 15 minutes
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
            if (pastQuestionData.year) {
                formData.append("year", pastQuestionData.year.toString());
            }
            if (pastQuestionData.file) {
                formData.append("file", pastQuestionData.file);
            }

            // Use apiClient for consistency
            return apiClient.post<PastQuestion>("/past-questions", formData);
        },
        onMutate: async (newPastQuestion) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: pastQuestionKeys.lists(),
            });
            await queryClient.cancelQueries({
                queryKey: pastQuestionKeys.byCourse(newPastQuestion.courseId),
            });

            // Snapshot the previous values
            const previousPastQuestions = queryClient.getQueryData(
                pastQuestionKeys.lists()
            );
            const previousCoursePastQuestions = queryClient.getQueryData(
                pastQuestionKeys.byCourse(newPastQuestion.courseId)
            );

            // Optimistically update the past questions list
            queryClient.setQueryData(
                pastQuestionKeys.lists(),
                (
                    old:
                        | { pastQuestions: PastQuestion[]; total: number }
                        | undefined
                ) => {
                    if (!old) return { pastQuestions: [], total: 0 };
                    const optimisticPastQuestion = {
                        id: "temp-id",
                        title: newPastQuestion.title,
                        year: newPastQuestion.year || new Date().getFullYear(),
                        fileUrl: newPastQuestion.file || "",
                        fileType: "pdf",
                    } as PastQuestion;
                    return {
                        pastQuestions: [
                            ...old.pastQuestions,
                            optimisticPastQuestion,
                        ],
                        total: old.total + 1,
                    };
                }
            );

            // Optimistically update course past questions
            queryClient.setQueryData(
                pastQuestionKeys.byCourse(newPastQuestion.courseId),
                (old: PastQuestion[] | undefined) => {
                    if (!old) return [];
                    const optimisticPastQuestion = {
                        id: "temp-id",
                        title: newPastQuestion.title,
                        year: newPastQuestion.year || new Date().getFullYear(),
                        fileUrl: newPastQuestion.file || "",
                        fileType: "pdf",
                    } as PastQuestion;
                    return [...old, optimisticPastQuestion];
                }
            );

            return { previousPastQuestions, previousCoursePastQuestions };
        },
        onError: (err, newPastQuestion, context) => {
            // Rollback on error
            if (context?.previousPastQuestions) {
                queryClient.setQueryData(
                    pastQuestionKeys.lists(),
                    context.previousPastQuestions
                );
            }
            if (context?.previousCoursePastQuestions) {
                queryClient.setQueryData(
                    pastQuestionKeys.byCourse(newPastQuestion.courseId),
                    context.previousCoursePastQuestions
                );
            }
            showApiError(err);
        },
        onSettled: (data, error, variables) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({
                queryKey: pastQuestionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: pastQuestionKeys.byCourse(variables.courseId),
            });
        },
    });
}

// Hook to delete a past question
export function useDeletePastQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            apiClient.delete<PastQuestion>(`/past-questions/${id}`),
        onMutate: async (pastQuestionId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: pastQuestionKeys.lists(),
            });

            // Snapshot the previous value
            const previousPastQuestions = queryClient.getQueryData(
                pastQuestionKeys.lists()
            );

            // Optimistically remove the past question from lists
            queryClient.setQueryData(
                pastQuestionKeys.lists(),
                (
                    old:
                        | { pastQuestions: PastQuestion[]; total: number }
                        | undefined
                ) => {
                    if (!old) return old;
                    return {
                        pastQuestions: old.pastQuestions.filter(
                            (pq) => pq.id !== pastQuestionId
                        ),
                        total: old.total - 1,
                    };
                }
            );

            return { previousPastQuestions };
        },
        onError: (err, pastQuestionId, context) => {
            // Rollback on error
            if (context?.previousPastQuestions) {
                queryClient.setQueryData(
                    pastQuestionKeys.lists(),
                    context.previousPastQuestions
                );
            }
            showApiError(err);
        },
        onSettled: (data, error, pastQuestionId) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({
                queryKey: pastQuestionKeys.lists(),
            });
            // Remove the individual past question from cache
            queryClient.removeQueries({
                queryKey: pastQuestionKeys.detail(pastQuestionId),
            });
        },
    });
}
