import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, showApiError } from "@/lib/api-client";
import { authKeys, userStorage } from "@/hooks/use-auth";
import type { User } from "@/types";

// Types for profile updates
export type ProfileUpdateData = {
  name: string;
  email: string;
  matricNumber: string;
  level: number;
  currentSemester: 1 | 2;
  // Note: department and faculty are excluded as they can't be edited
};

export type AvatarUpdateData = {
  avatar: string; // URL or base64 string
};

// Hook to update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileUpdateData) =>
      apiClient.put<User>("/user/profile", data),
    onSuccess: (updatedUser) => {
      // Update localStorage with new user data
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        userStorage.setUser(updatedUser, currentToken);
      }

      // Update the current user in the query cache using correct key
      queryClient.setQueryData(authKeys.user, updatedUser);
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

// Hook to update user avatar
export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AvatarUpdateData) =>
      apiClient.put<User>("/user/avatar", data),
    onSuccess: (updatedUser) => {
      // Update localStorage with new user data
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        userStorage.setUser(updatedUser, currentToken);
      }

      // Update the current user in the query cache using correct key
      queryClient.setQueryData(authKeys.user, updatedUser);
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
    onError: (error) => {
      showApiError(error);
    },
  });
}

// Hook to upload avatar file
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);

      const token = localStorage.getItem("token");
      const headers: HeadersInit = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("/api/v1/user/avatar/upload", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload avatar: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: (result) => {
      // The API returns both avatarUrl and updated user data
      const updatedUser = result.user;

      // Update localStorage with new user data
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        userStorage.setUser(updatedUser, currentToken);
      }

      // Update the current user in the query cache using correct key
      queryClient.setQueryData(authKeys.user, updatedUser);
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
    onError: (error) => {
      console.error("Avatar upload error:", error);
    },
  });
}

// Hook to get profile completion percentage
export function useProfileCompletion(user: User | undefined) {
  if (!user) return 0;

  const fields = [
    user.name,
    user.email,
    user.matricNumber,
    user.department,
    user.faculty,
    user.level,
    user.currentSemester,
    user.avatar,
  ];

  const completedFields = fields.filter(field =>
    field !== undefined && field !== null && field !== ""
  ).length;

  return Math.round((completedFields / fields.length) * 100);
}
