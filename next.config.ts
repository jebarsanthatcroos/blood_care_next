import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  reactStrictMode: true,
  experimental: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  trailingSlash: false,
};

export default nextConfig;
