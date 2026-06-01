import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  reactCompiler: true,
  experimental: {
    optimizeCss: true,
    cssChunking: true,
    inlineCss: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  poweredByHeader: false,
};

export default nextConfig;
