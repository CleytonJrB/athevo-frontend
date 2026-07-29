import type { NextConfig } from "next";

const allowedDevOrigin = process.env.NEXT_ALLOWED_DEV_ORIGIN;

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: allowedDevOrigin ? [allowedDevOrigin] : [],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
