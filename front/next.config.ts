import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,  // Temporarily disable ESLint during builds
  },
};

export default nextConfig;