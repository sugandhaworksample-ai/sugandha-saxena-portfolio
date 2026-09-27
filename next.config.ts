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
  async headers() {
    return [
      {
        source: "/resume/:file*.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Sugandha Saxena CV.pdf"',
          },
          {
            key: "Content-Type",
            value: "application/pdf",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/motion",
        destination: "/projects/motion-and-video",
        permanent: false,
      },
      {
        source: "/ai",
        destination: "/projects/ai-creative",
        permanent: false,
      },
      {
        source: "/projects/logo-design",
        destination: "/projects/branding/logo",
        permanent: true,
      },
      {
        source: "/projects/visiting-card-design",
        destination: "/projects/branding/stationery",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
