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
  webpack: (config) => {
    // This is necessary for the react-pdf library
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false

    return config
  },
}

export default nextConfig
