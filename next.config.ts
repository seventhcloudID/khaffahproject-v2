import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Izinkan akses dev dari 127.0.0.1 dan localhost (agar http://127.0.0.1:3000 bisa dipakai)
  allowedDevOrigins: ["http://127.0.0.1:3000", "http://localhost:3000"],
  // turbopack root dihapus - bisa sebabkan error di beberapa environment
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.kaffahtrip.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "apikaffah.paperostudio.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  // Ensure server can be accessed
  async rewrites() {
    return [];
  },
};

export default nextConfig;
