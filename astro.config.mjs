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
      external: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
    },
    optimizeDeps: {
      exclude: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
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
