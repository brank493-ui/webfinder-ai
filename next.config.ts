import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for better Vercel compatibility
  output: "standalone",
  
  // React strict mode for better development experience
  reactStrictMode: true,
  
  // TypeScript configuration
  typescript: {
    // Don't ignore build errors in production
    ignoreBuildErrors: false,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app', '*.vercelusercontent.com'],
    },
  },
};

export default nextConfig;
