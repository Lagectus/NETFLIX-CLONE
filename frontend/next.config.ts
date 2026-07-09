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
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "gsap",
      "@react-three/fiber",
      "@react-three/drei",
      "three",
    ],
  },
  // Transpile Three.js ecosystem
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;
