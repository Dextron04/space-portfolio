import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['github.com', 'raw.githubusercontent.com', 'user-images.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
