import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@batch/core": path.resolve(__dirname, "../../packages/core/src/index.ts"),
      "@batch/db": path.resolve(__dirname, "../../packages/db/src/index.ts"),
      "@batch/payments": path.resolve(__dirname, "../../packages/payments/src/index.ts"),
    };
    return config;
  },
};

export default nextConfig;
