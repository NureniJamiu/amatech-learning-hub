import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    serverExternalPackages: ["pdf-parse"],
    // Updated Turbopack configuration (moved from experimental.turbo)
    turbopack: {
        rules: {
            "*.pdf": ["raw-loader"],
        },
    },
    webpack: (config, { isServer, dev, webpack }) => {
        // Only apply webpack config in production builds
        // Turbopack handles development builds
        if (dev) {
            return config;
        }

        // This is necessary for the react-pdf library
        config.resolve.alias.canvas = false;
        config.resolve.alias.encoding = false;

        // Handle server-side PDF processing
        if (isServer) {
            // Mark pdf-parse as external to avoid bundling issues
            config.externals = config.externals || [];
            config.externals.push("pdf-parse");

            // Ensure file system and path modules work correctly
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                os: false,
            };
        }

        return config;
    },
};

export default nextConfig
