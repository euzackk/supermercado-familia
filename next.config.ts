import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Ignora erros de ESLint e TypeScript na hora de criar o site (Build) */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* Garante que imagens externas funcionem se você usar o componente Image do Next */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;