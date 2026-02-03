import type { NextConfig } from "next";

import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // output: 'export', // ❌ Dynamic APIs cannot be blindly exported to static
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Enterprise Edge & CDN Optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // unoptimized: true, // Reverted: Vercel supports optimization
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "ruby-tea",
  project: "ruby-tea-web",
});
