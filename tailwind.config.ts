import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        ptMono: ['var(--font-pt-mono)'],
        inter: ['var(--font-inter)'],
        playfair: ['var(--font-playfair)'],
      },
      colors: {
        backgroundColor: '#181a1b',
        darkGrey: '#363b3d',
        quillGray: '#e2e2dd',
        codGray: '#191919', // Main background color
        gunSmoke: '#838484',
        accent: {
          light: '#8ecfd6',
          DEFAULT: '#64b2bc',
          dark: '#4a8a91',
        },
        bgShades: {
          lighter: '#252525',
          light: '#212121',
          DEFAULT: '#1d1d1d',
          dark: '#191919',
          darker: '#151515',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;