import { useQuery } from "@tanstack/react-query";

export type AnalyticsType =
    | "overview"
    | "course-usage"
    | "content-distribution"
    | "level-distribution"
    | "recent-activity"
    | "semester-breakdown";

export function useServerAnalytics<T = any>(type: AnalyticsType) {
    return useQuery({
        queryKey: ["server-analytics", type],
        queryFn: async () => {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("token")
                    : undefined;
            const res = await fetch(`/api/v1/analytics?type=${type}`, {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined,
            });
            if (!res.ok) throw new Error("Failed to fetch analytics");
            return res.json() as Promise<T>;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}
