import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    // Strip trailing /api if present since source paths already include it
    const baseUrl = backendUrl.replace(/\/api\/?$/, "");

    // List every backend route explicitly to avoid proxying /api/auth/*
    const routes = [
      "interviews",
      "resumes",
      "templates",
      "dashboard",
      "favorites",
      "stats",
      "faqs",
      "testimonials",
      "contact",
    ];

    const rewrites: { source: string; destination: string }[] = [];
    for (const route of routes) {
      rewrites.push({
        source: `/api/${route}`,
        destination: `${baseUrl}/api/${route}`,
      });
      rewrites.push({
        source: `/api/${route}/:path*`,
        destination: `${baseUrl}/api/${route}/:path*`,
      });
    }

    return rewrites;
  },
};

export default nextConfig;
