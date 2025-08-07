import { toast } from "react-toastify";

// API base URL - can be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

// Error type for API responses
export type ApiError = {
    message: string;
    errors?: Record<string, string[]>;
    status?: number;
};

// Options for API requests
export type ApiOptions = {
    headers?: HeadersInit;
    params?: Record<string, string | number | boolean | undefined>;
    cache?: RequestCache;
    tags?: string[];
    signal?: AbortSignal;
    skipAuth?: boolean; // New option to skip authentication
};

// Token management utilities
export const tokenManager = {
    getToken: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("token");
    },

    setToken: (token: string): void => {
        if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
        }
    },

    removeToken: (): void => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    },

    isValidToken: (token: string): boolean => {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },
};

// Function to build URL with query parameters
const buildUrl = (
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
) => {
    // Check if endpoint is already a full URL
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
        const url = new URL(endpoint);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            });
        }
        return url.toString();
    }

    // For relative URLs, construct the full path
    let fullPath = `${API_BASE_URL}${endpoint}`;

    // Add query parameters if provided
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            fullPath += `?${queryString}`;
        }
    }

    return fullPath;
};

// Base function for making API requests
async function apiRequest<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    options: ApiOptions = {}
): Promise<T> {
    const { headers = {}, params, signal, skipAuth = false } = options;

    const url = buildUrl(endpoint, params);
    console.log("Making API request:", method, url);

    const token = tokenManager.getToken();
    const isFormData = data instanceof FormData;

    // Check if token is valid before making request
    if (token && !tokenManager.isValidToken(token)) {
        tokenManager.removeToken();
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        throw new Error("Session expired. Please login again.");
    }

    // Don't add Authorization header for auth endpoints or if skipAuth is true
    const isAuthEndpoint = endpoint.includes("/auth/");
    const shouldAddAuth = token && !isAuthEndpoint && !skipAuth;

    const headersWithAuth = {
        ...(shouldAddAuth ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
    };

    const requestOptions: RequestInit = {
        method,
        headers: isFormData
            ? headersWithAuth // do NOT set Content-Type if FormData
            : {
                  "Content-Type": "application/json",
                  ...headersWithAuth,
              },
        credentials: "include",
        signal,
    };

    if (data) {
        requestOptions.body = isFormData ? data : JSON.stringify(data);
    }

    try {
        console.log("Sending request with options:", {
            method,
            url,
            headers: headersWithAuth,
        });
        const response = await fetch(url, requestOptions);
        console.log("Response status:", response.status);

        // Handle 401 responses by redirecting to login
        if (response.status === 401) {
            tokenManager.removeToken();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            throw new Error("Authentication required");
        }

        // Handle non-JSON responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const json = await response.json();
            console.log("API Response:", {
                url,
                status: response.status,
                data: json,
            });

            if (!response.ok) {
                const error: ApiError = {
                    message: json.message || "An error occurred",
                    errors: json.errors,
                    status: response.status,
                };
                throw error;
            }

            return json as T;
        } else {
            const textResponse = await response.text();
            console.log("API Response (text):", {
                url,
                status: response.status,
                data: textResponse,
            });

            if (!response.ok) {
                throw {
                    message: `Request failed with status ${response.status}`,
                    status: response.status,
                };
            }

            return textResponse as unknown as T;
        }
    } catch (error) {
        console.error("API request error:", error);
        // Handle network errors and other exceptions
        if (error instanceof Error) {
            throw {
                message: error.message || "Network error",
                status: 0,
            };
        }
        throw error;
    }
}

// Convenience methods for different HTTP methods
export const apiClient = {
    get: <T>(endpoint: string, options?: ApiOptions) =>
        apiRequest<T>("GET", endpoint, undefined, options),

    post: <T>(endpoint: string, data?: unknown, options?: ApiOptions) =>
        apiRequest<T>("POST", endpoint, data, options),

    put: <T>(endpoint: string, data?: unknown, options?: ApiOptions) =>
        apiRequest<T>("PUT", endpoint, data, options),

    patch: <T>(endpoint: string, data?: unknown, options?: ApiOptions) =>
        apiRequest<T>("PATCH", endpoint, data, options),

    delete: <T>(endpoint: string, options?: ApiOptions) =>
        apiRequest<T>("DELETE", endpoint, undefined, options),
};

// Error handler for API requests
export function handleApiError(error: unknown): string {
    if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;

        // Handle validation errors
        if (apiError.errors) {
            const firstError = Object.values(apiError.errors)[0]?.[0];
            if (firstError) {
                return firstError;
            }
        }

        // Handle general error message
        if (apiError.message) {
            return apiError.message;
        }
    }

    return "An unexpected error occurred";
}

// Hook for showing API errors as toasts
export function showApiError(error: unknown) {
    const errorMessage = handleApiError(error);
    console.error("API Error:", errorMessage);

    // Use react-toastify for error notifications
    toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}
