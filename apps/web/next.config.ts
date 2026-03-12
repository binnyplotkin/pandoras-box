import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@odyssey/types",
    "@odyssey/utils",
    "@odyssey/db",
    "@odyssey/engine",
    "@odyssey/ui",
  ],
};

export default nextConfig;
