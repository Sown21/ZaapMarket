import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Génère un build autonome pour Docker
};

export default nextConfig;