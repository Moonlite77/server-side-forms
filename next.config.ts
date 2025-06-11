import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'fast-stag-26.clerk.accounts.dev',
        'api.clerk.com'
      ],
      bodySizeLimit: '4mb',
    },
  },
  // Moved from experimental.serverComponentsExternalPackages to root level
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;
