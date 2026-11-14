import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn-govindas.s3.eu-west-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
