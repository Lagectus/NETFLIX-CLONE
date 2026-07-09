import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Disable Turbopack — use Webpack (required on systems blocking native SWC binaries) */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "*.cloudflare.com",
      },
    ],
  },
  // Transpile Three.js ecosystem
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  generateBuildId: async () => {
    // Force cache bust on Vercel
    return 'cinevault-build-' + Date.now();
  },
};

export default nextConfig;
