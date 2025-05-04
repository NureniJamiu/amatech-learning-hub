import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { Tutor } from "@/types";

// Query keys for React Query
export const tutorKeys = {
  all: ["tutors"] as const,
  lists: () => [...tutorKeys.all, "list"] as const,
  list: (filters: TutorFilters) => [...tutorKeys.lists(), filters] as const,
  details: () => [...tutorKeys.all, "detail"] as const,
  detail: (id: string) => [...tutorKeys.details(), id] as const,
};

export type TutorFilters = {
  search?: string;
  page?: number;
  limit?: number;
};

export type TutorInput = {
  name: string;
  email: string;
  avatar?: string | File;
};

// Hook to fetch tutors with filters
export function useTutors(filters: TutorFilters = {}) {
  return useQuery({
    queryKey: tutorKeys.list(filters),
    queryFn: () =>
      apiClient.get<{ tutors: Tutor[]; total: number }>("/tutors", {
        params: filters,
      }),
  });
}

// Hook to fetch a single tutor by ID
export function useTutor(id: string) {
  return useQuery({
    queryKey: tutorKeys.detail(id),
    queryFn: () => apiClient.get<Tutor>(`/tutors/${id}`),
    enabled: !!id, // Only run if ID is provided
  });
}

// Hook to create a new tutor
export function useCreateTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tutorData: TutorInput) => {
      // Handle file upload if avatar is a File
      if (tutorData.avatar instanceof File) {
        const formData = new FormData();
        formData.append("name", tutorData.name);
        formData.append("email", tutorData.email);
        formData.append("avatar", tutorData.avatar);

        // Use fetch directly for FormData
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "/api"}/tutors`,
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
      }

      // Regular JSON request
      return apiClient.post<Tutor>("/tutors", tutorData);
    },
    onSuccess: () => {
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
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TutorInput>;
    }) => {
      // Handle file upload if avatar is a File
      if (data.avatar instanceof File) {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        formData.append("avatar", data.avatar);

        // Use fetch directly for FormData
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "/api"}/tutors/${id}`,
          {
            method: "PUT",
            body: formData,
            credentials: "include",
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw error;
        }

        return await response.json();
      }

      // Regular JSON request
      return apiClient.put<Tutor>(`/tutors/${id}`, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: tutorKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: tutorKeys.lists() });
    },
    onError: (error) => {
      showApiError(error);
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
