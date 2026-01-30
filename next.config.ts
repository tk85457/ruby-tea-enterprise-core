import type { NextConfig } from "next";

import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Enterprise Edge & CDN Optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "ruby-tea",
  project: "ruby-tea-web",
});
