// API base URL - can be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

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
};

// Function to build URL with query parameters
const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

// Base function for making API requests
async function apiRequest<T>(
  method: string,
  endpoint: string,
  data?: unknown,
  options: ApiOptions = {}
): Promise<T> {
  const { headers = {}, params, signal } = options;

  const url = buildUrl(endpoint, params);

  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Include cookies for authentication
    signal,
  };

  if (data) {
    requestOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, requestOptions);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const json = await response.json();

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
      if (!response.ok) {
        throw {
          message: `Request failed with status ${response.status}`,
          status: response.status,
        };
      }

      return (await response.text()) as unknown as T;
    }
  } catch (error) {
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

  //TODO: Use react-toastify here. Uncomment the following lines when react-toastify is set up
  // import { toast } from "react-toastify";
  //   toast({
  //     title: "Error",
  //     description: errorMessage,
  //     variant: "destructive",
  //   });
}
