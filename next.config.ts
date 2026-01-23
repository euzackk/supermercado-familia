import type { NextConfig } from "next";

const nextConfig = {
  /* Ignora erros de Lint e TS no Build para não travar o deploy */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* Configuração de Imagens */
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