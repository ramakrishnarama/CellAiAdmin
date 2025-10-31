import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*", // proxy any /api/* request
        destination: "http://52.90.158.135:4000/api/:path*", // your Node backend
      },
    ];
  },
};

export default nextConfig;
