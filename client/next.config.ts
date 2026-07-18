import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return [
      {
        source: "/api/interviews/:path*",
        destination: `${backendUrl}/api/interviews/:path*`,
      },
      {
        source: "/api/interviews",
        destination: `${backendUrl}/api/interviews`,
      },
      {
        source: "/api/resumes/:path*",
        destination: `${backendUrl}/api/resumes/:path*`,
      },
      {
        source: "/api/resumes",
        destination: `${backendUrl}/api/resumes`,
      },
      {
        source: "/api/templates/:path*",
        destination: `${backendUrl}/api/templates/:path*`,
      },
      {
        source: "/api/templates",
        destination: `${backendUrl}/api/templates`,
      },
      {
        source: "/api/dashboard/:path*",
        destination: `${backendUrl}/api/dashboard/:path*`,
      },
      {
        source: "/api/dashboard",
        destination: `${backendUrl}/api/dashboard`,
      },
      {
        source: "/api/favorites/:path*",
        destination: `${backendUrl}/api/favorites/:path*`,
      },
      {
        source: "/api/favorites",
        destination: `${backendUrl}/api/favorites`,
      },
      {
        source: "/api/stats",
        destination: `${backendUrl}/api/stats`,
      },
      {
        source: "/api/faqs",
        destination: `${backendUrl}/api/faqs`,
      },
      {
        source: "/api/testimonials",
        destination: `${backendUrl}/api/testimonials`,
      },
      {
        source: "/api/contact",
        destination: `${backendUrl}/api/contact`,
      },
    ];
  },
};

export default nextConfig;
