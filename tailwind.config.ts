import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Add this for dark mode support
  theme: {
    extend: {
      fontFamily: {
        ptMono: ['var(--font-pt-mono)'],
        inter: ['var(--font-inter)'],
        playfair: ['var(--font-playfair)'],
      },
      colors: {
        backgroundColor: '#181a1b', // Fixed spelling
        darkGrey: '#363b3d',
        quillGray: '#e2e2dd',
        codGray: '#1d1d1d',
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