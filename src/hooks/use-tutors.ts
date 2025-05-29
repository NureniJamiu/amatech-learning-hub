import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import { Course } from "@/types";

// Query keys for Tutors
export const tutorKeys = {
    all: ["tutors"] as const,
    lists: () => [...tutorKeys.all, "list"] as const,
    list: (filters: TutorFilters) => [...tutorKeys.lists(), filters] as const,
    details: () => [...tutorKeys.all, "detail"] as const,
    detail: (id: string) => [...tutorKeys.details(), id] as const,
};

// Types
export type Tutor = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    courses?: Course[]; // Course codes assigned to tutor
    createdAt?: string;
    updatedAt?: string;
};

export type TutorFilters = {
    search?: string;
    page?: number;
    limit?: number;
};

export type TutorInput = {
    name: string;
    email: string;
    avatar?: string;
};

// Hook to fetch tutors with filters
export function useTutors(filters: TutorFilters = {}) {
    return useQuery({
        queryKey: tutorKeys.list(filters),
        queryFn: () =>
            apiClient.get<{ tutors: Tutor[]; total: number }>("/tutors", {
                params: filters,
            }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}

// Hook to fetch a single tutor by ID
export function useTutor(id: string) {
    return useQuery({
        queryKey: tutorKeys.detail(id),
        queryFn: () => apiClient.get<Tutor>(`/tutors/${id}`),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

// Hook to create a new tutor
export function useCreateTutor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tutorData: TutorInput) =>
            apiClient.post<Tutor>("/tutors", tutorData),
        onSuccess: (newTutor) => {
            // Optimistically update the cache
            queryClient.setQueriesData(
                { queryKey: tutorKeys.lists() },
                (oldData: { tutors: Tutor[]; total: number } | undefined) => {
                    if (!oldData) return { tutors: [newTutor], total: 1 };
                    return {
                        tutors: [newTutor, ...oldData.tutors],
                        total: oldData.total + 1,
                    };
                }
            );
            // Also invalidate to ensure fresh data
            queryClient.invalidateQueries({ queryKey: tutorKeys.lists() });
        },
        onError: (error) => {
            showApiError(error);
        },
    });
}

// Hook to update an existing tutor
export function useUpdateTutor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<TutorInput> }) =>
            apiClient.put<Tutor>(`/tutors/${id}`, data),
        onMutate: async ({ id, data }) => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: tutorKeys.detail(id) });
            const previousTutor = queryClient.getQueryData(
                tutorKeys.detail(id)
            );

            queryClient.setQueryData(
                tutorKeys.detail(id),
                (old: Tutor | undefined) => (old ? { ...old, ...data } : old)
            );

            return { previousTutor };
        },
        onSuccess: (updatedTutor, variables) => {
            queryClient.setQueryData(
                tutorKeys.detail(variables.id),
                updatedTutor
            );
            queryClient.invalidateQueries({ queryKey: tutorKeys.lists() });
        },
        onError: (err, { id }, context) => {
            if (context?.previousTutor) {
                queryClient.setQueryData(
                    tutorKeys.detail(id),
                    context.previousTutor
                );
            }
            showApiError(err);
        },
    });
}

// Hook to delete a tutor
export function useDeleteTutor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.delete<void>(`/tutors/${id}`),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: tutorKeys.lists() });
            queryClient.removeQueries({ queryKey: tutorKeys.detail(id) });
        },
        onError: (error) => {
            showApiError(error);
        },
    });
}
