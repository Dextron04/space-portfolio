import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone", // self-contained server.js for the mac-agent deploy
  async redirects() {
    // dextron04.in is canonical
    return [{ source: "/:path*", has: [{ type: "host", value: "www.dextron04.in" }], destination: "https://dextron04.in/:path*", permanent: true }]
  },
}

export default nextConfig
