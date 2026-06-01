import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  reactCompiler: true,
  poweredByHeader: false,
  experimental: {
    cssChunking: true,
    inlineCss: true,
    optimizeCss: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  typedRoutes: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
