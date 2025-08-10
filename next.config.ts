import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NGROK_DOMAIN && {
    allowedDevOrigins: [process.env.NGROK_DOMAIN]
  })
};

export default nextConfig;
