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
    // The earlier gallery design stays reachable but unlisted.
    sitemap({ filter: (page) => !page.includes('/gallery/tape') }),
  ],
  output: 'hybrid',
  adapter: vercel({
    functionPerRoute: false,
    edgeMiddleware: false,
    imageService: true,
    // Vercel's default sizes plus 256 for gallery contact-sheet thumbnails.
    imagesConfig: {
      sizes: [256, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      domains: [],
      remotePatterns: [
        { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
        { protocol: 'https', hostname: 'artifacts.rishia.in', pathname: '/events/**' },
      ],
    },
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
