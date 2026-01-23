import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Supermercado Família',
    short_name: 'App do Família',
    description: 'O melhor supermercado para sua casa',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e3a8a',
    icons: [
      {
        src: '/logo-app.png', // <--- MUDAR AQUI
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-app.png', // <--- MUDAR AQUI
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}