import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      // Apply Tailwind's base styles
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  output: 'hybrid',
  adapter: vercel({
    functionPerRoute: false,
    edgeMiddleware: false,
    imageService: true,
    webAnalytics: {
      enabled: true
    }
  }),
  site: 'https://rishia.in',
  vite: {
    ssr: {
      noExternal: ['react-icons', 'react-type-animation'],
    },
  },
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
});
