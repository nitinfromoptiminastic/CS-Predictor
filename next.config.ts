import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['sharp'],
  experimental: {
    // Enable support for large file uploads
    serverActions: {
      bodySizeLimit: '5gb',
    },
  },
};

export default nextConfig;
