import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Elevate HER Workday',
    short_name: 'Elevate HER',
    description: 'A practical plan for the days work feels harder.',
    start_url: '/',
    display: 'standalone',
    background_color: '#e8dde5',
    theme_color: '#4a154b',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
