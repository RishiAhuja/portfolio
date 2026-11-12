import type { Config } from 'tailwindcss';

const palette = (name: string, rgb: string) => `rgb(var(--palette-${name}, ${rgb}) / <alpha-value>)`;

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
      // Each colour reads a --palette-* variable whose fallback is the
      // archive's own colour, so pages look the same unless a page sets the
      // variable. The admin sets them to rishia.in's light palette.
      colors: {
        backgroundColor: '#181a1b',
        darkGrey: palette('darkgrey', '54 59 61'),
        quillGray: palette('quillgray', '226 226 221'),
        codGray: palette('codgray', '25 25 25'), // Main background color
        gunSmoke: palette('gunsmoke', '131 132 132'),
        accent: {
          light: palette('accent-light', '142 207 214'),
          DEFAULT: palette('accent', '100 178 188'),
          dark: palette('accent-dark', '74 138 145'),
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