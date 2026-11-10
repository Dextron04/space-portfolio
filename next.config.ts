import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone", // self-contained server.js for the mac-agent deploy
}

export default nextConfig
