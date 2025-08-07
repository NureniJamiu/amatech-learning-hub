import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import type { Material, Material2 } from "@/types";

// Query keys for React Query
export const materialKeys = {
    all: ["materials"] as const,
    lists: () => [...materialKeys.all, "list"] as const,
    list: (filters: MaterialFilters) =>
        [...materialKeys.lists(), filters] as const,
    infinite: (filters: Omit<MaterialFilters, 'page'>) =>
        [...materialKeys.lists(), "infinite", filters] as const,
    details: () => [...materialKeys.all, "detail"] as const,
    detail: (id: string) => [...materialKeys.details(), id] as const,
    byCourse: (courseId: string) =>
        [...materialKeys.all, "course", courseId] as const,
};

// Types
export type MaterialFilters = {
    courseId?: string;
    search?: string;
    page?: number;
    limit?: number;
};

export type MaterialInput = {
    title: string;
    courseId: string;
    file: string | null;
    type?: string;
};

// Hook to fetch materials with filters (optimized)
export function useMaterials(filters: MaterialFilters = {}) {
    // Set reasonable default limit
    const optimizedFilters = {
        limit: 20, // Reduced from potentially large numbers
        ...filters,
    };

    return useQuery({
        queryKey: materialKeys.list(optimizedFilters),
        queryFn: () =>
            apiClient.get<{ materials: Material2[]; total: number }>(
                "/materials",
                {
                    params: optimizedFilters,
                }
            ),
        staleTime: 1000 * 60 * 3, // 3 minutes (materials change more frequently)
        gcTime: 1000 * 60 * 10, // 10 minutes
        placeholderData: (previousData) => previousData,
    });
}

// Hook for infinite materials (better for large lists)
export function useInfiniteMaterials(filters: Omit<MaterialFilters, 'page'> = {}) {
    const optimizedFilters = {
        limit: 20,
        ...filters,
    };

    return useInfiniteQuery({
        queryKey: materialKeys.infinite(optimizedFilters),
        queryFn: ({ pageParam = 1 }) =>
            apiClient.get<{ materials: Material2[]; total: number; page: number; totalPages: number }>("/materials", {
                params: { ...optimizedFilters, page: pageParam },
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        staleTime: 1000 * 60 * 3, // 3 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
}

// Hook to fetch materials for a specific course (optimized)
export function useCoursesMaterials(courseId: string) {
    return useQuery({
        queryKey: materialKeys.byCourse(courseId),
        queryFn: () =>
            apiClient.get<Material[]>(`/courses/${courseId}/materials`),
        enabled: !!courseId, // Only run if courseId is provided
        staleTime: 1000 * 60 * 5, // 5 minutes (course materials are more stable)
        gcTime: 1000 * 60 * 15, // 15 minutes
        placeholderData: (previousData) => previousData,
    });
}

// Hook to fetch a single material by ID
export function useMaterial(id: string) {
    return useQuery({
        queryKey: materialKeys.detail(id),
        queryFn: () => apiClient.get<Material>(`/materials/${id}`),
        enabled: !!id, // Only run if ID is provided
        staleTime: 1000 * 60 * 10, // 10 minutes
        gcTime: 1000 * 60 * 20, // 20 minutes
    });
}

// Hook to upload a new material (optimized)
export function useUploadMaterial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (materialData: MaterialInput) => {
            const formData = new FormData();
            formData.append("title", materialData.title);
            formData.append("courseId", materialData.courseId);
            if (materialData.file !== null) {
                formData.append("file", materialData.file);
            }

            // Use apiClient for consistency
            return apiClient.post<Material2>("/materials", formData);
        },
        onMutate: async (newMaterial) => {
            // Cancel any outgoing refetches for all related queries
            await queryClient.cancelQueries({ queryKey: materialKeys.lists() });
            await queryClient.cancelQueries({
                queryKey: materialKeys.byCourse(newMaterial.courseId),
            });

            // Get course information for optimistic update
            const coursesQuery = queryClient.getQueriesData({
                queryKey: ["courses"],
            });
            let courseInfo = { code: "Loading...", title: "Loading..." };

            // Try to find the course in the cache
            for (const [, data] of coursesQuery) {
                if (data && typeof data === "object" && "courses" in data) {
                    const courses = (data as any).courses;
                    const foundCourse = courses?.find(
                        (c: any) => c.id === newMaterial.courseId
                    );
                    if (foundCourse) {
                        courseInfo = {
                            code: foundCourse.code,
                            title: foundCourse.title,
                        };
                        break;
                    }
                }
            }

            // Snapshot the previous values
            const previousMaterials = queryClient.getQueryData(
                materialKeys.lists()
            );
            const previousCourseMaterials = queryClient.getQueryData(
                materialKeys.byCourse(newMaterial.courseId)
            );

            // Create optimistic material with correct course info
            const optimisticMaterial = {
                id: "temp-id",
                title: newMaterial.title,
                fileUrl: newMaterial.file || "",
                fileType: "pdf",
                createdAt: new Date().toISOString(),
                course: courseInfo,
                uploadedBy: {
                    id: "temp",
                    firstname: "Loading",
                    lastname: "",
                    email: "",
                },
            } as Material2;

            // Optimistically update all material list queries
            queryClient.setQueriesData(
                { queryKey: materialKeys.lists() },
                (
                    old: { materials: Material2[]; total: number } | undefined
                ) => {
                    if (!old)
                        return { materials: [optimisticMaterial], total: 1 };
                    return {
                        materials: [optimisticMaterial, ...old.materials], // Add to beginning for recent items
                        total: old.total + 1,
                    };
                }
            );

            // Optimistically update course materials
            queryClient.setQueryData(
                materialKeys.byCourse(newMaterial.courseId),
                (old: Material[] | undefined) => {
                    if (!old) return [optimisticMaterial as Material];
                    return [optimisticMaterial as Material, ...old];
                }
            );

            return { previousMaterials, previousCourseMaterials };
        },
        onError: (err, newMaterial, context) => {
            // Rollback on error
            if (context?.previousMaterials) {
                queryClient.setQueriesData({ queryKey: materialKeys.lists() }, context.previousMaterials);
            }
            if (context?.previousCourseMaterials) {
                queryClient.setQueryData(
                    materialKeys.byCourse(newMaterial.courseId),
                    context.previousCourseMaterials
                );
            }
            showApiError(err);
        },
        onSettled: (data, error, variables) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: materialKeys.byCourse(variables.courseId)
            });
            // Also invalidate infinite queries
            queryClient.invalidateQueries({ queryKey: materialKeys.infinite({}) });

            // Invalidate course queries to update material counts in course objects
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
}

// Hook to delete a material (optimized)
export function useDeleteMaterial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.delete<Material2>(`/materials/${id}`),
        onMutate: async (materialId) => {
            // Get the material data before deletion for optimistic updates
            const materialToDelete = queryClient.getQueryData<Material2>(materialKeys.detail(materialId));

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: materialKeys.lists() });

            // Snapshot the previous values
            const previousMaterials = queryClient.getQueryData(materialKeys.lists());

            // Optimistically remove the material from all list queries
            queryClient.setQueriesData(
                { queryKey: materialKeys.lists() },
                (old: { materials: Material2[]; total: number } | undefined) => {
                    if (!old) return old;
                    return {
                        materials: old.materials.filter(material => material.id !== materialId),
                        total: old.total - 1,
                    };
                }
            );

            return { previousMaterials, materialToDelete };
        },
        onError: (err, materialId, context) => {
            // Rollback on error
            if (context?.previousMaterials) {
                queryClient.setQueriesData({ queryKey: materialKeys.lists() }, context.previousMaterials);
            }
            showApiError(err);
        },
        onSettled: (data, error, materialId, context) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: materialKeys.lists() });

            // Remove the individual material from cache
            queryClient.removeQueries({ queryKey: materialKeys.detail(materialId) });

            // Invalidate all course material queries (since we can't be sure which course)
            queryClient.invalidateQueries({
                queryKey: [...materialKeys.all, "course"]
            });
        },
    });
}
