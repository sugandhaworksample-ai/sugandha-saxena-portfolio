import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mir-s3-cdn-cf.behance.net",
      },
      {
        protocol: "https",
        hostname: "www.behance.net",
      },
    ],
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default nextConfig;
