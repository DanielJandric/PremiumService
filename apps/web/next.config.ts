import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ['@premium/domain'],
  },
  eslint: {
    // Avoid failing production builds on lint issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Avoid failing production builds on type issues
    // (CI should check types separately if desired)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

