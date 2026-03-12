import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@pandora/types",
    "@pandora/utils",
    "@pandora/db",
  ],
};

export default nextConfig;
