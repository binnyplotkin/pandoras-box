import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["packages/engine/src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@pandora/types": path.resolve(__dirname, "packages/types/src"),
      "@pandora/utils": path.resolve(__dirname, "packages/utils/src"),
      "@pandora/db": path.resolve(__dirname, "packages/db/src"),
      "@pandora/engine": path.resolve(__dirname, "packages/engine/src"),
      "@/data/worlds": path.resolve(__dirname, "apps/web/src/data/worlds"),
    },
  },
});
