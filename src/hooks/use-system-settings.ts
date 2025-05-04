import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";

// Query keys for React Query
export const settingsKeys = {
  all: ["settings"] as const,
};

// Types
export type SystemSettings = {
  id: string;
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultTheme: string;
  smtpServer?: string;
  smtpPort?: string;
  smtpUsername?: string;
  smtpPassword?: string;
  fromEmail?: string;
  fromName?: string;
};

// Hook to fetch system settings (admin only)
export function useSystemSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: () => apiClient.get<SystemSettings>("/admin/settings"),
  });
}

// Hook to update system settings (admin only)
export function useUpdateSystemSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<SystemSettings>) =>
      apiClient.put<SystemSettings>("/admin/settings", settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}
