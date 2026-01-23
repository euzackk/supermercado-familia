import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Supermercado Família',
    short_name: 'Sup. Família',
    description: 'O melhor supermercado para sua casa',
    start_url: '/',
    display: 'standalone', // Faz abrir sem a barra do navegador
    background_color: '#ffffff',
    theme_color: '#1e3a8a', // Azul do seu header
    icons: [
      {
        src: '/logo.png', // Usando sua logo existente
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}