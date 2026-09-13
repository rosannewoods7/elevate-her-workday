import type { NextConfig } from "next";
// @ts-expect-error no types available
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  customWorkerDir: "noworker", // Hack to disable next-pwa's broken custom worker logic
})(nextConfig);
