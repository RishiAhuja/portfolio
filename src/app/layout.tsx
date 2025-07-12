import type { Metadata } from 'next';
import './globals.css';

import { PT_Mono, Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/theme-context';

const ptMono = PT_Mono({ 
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-pt-mono',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'Rishi Ahuja | Full Stack Developer & Designer',
    template: '%s | Rishi Ahuja',
  },
  description: 'Portfolio of Rishi Ahuja, a full stack developer and designer specializing in web and mobile app development.',
  keywords: ['developer', 'portfolio', 'web development', 'mobile development', 'React', 'Next.js', 'Flutter'],
  authors: [{ name: 'Rishi Ahuja', url: 'https://rishia.in' }],
  creator: 'Rishi Ahuja',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rishia.in',
    siteName: 'Rishi Ahuja',
    title: 'Rishi Ahuja | Full Stack Developer',
    description: 'Portfolio of Rishi Ahuja, a full stack developer specializing in web and mobile app development.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rishi Ahuja | Full Stack Developer',
    description: 'Portfolio of Rishi Ahuja, a full stack developer specializing in web and mobile app development.',
    creator: '@rishi2220',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Twitter Widget Script for Twitter Embeds */}
        <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
      </head>
      <body className={`${ptMono.variable} ${inter.variable} ${playfair.variable} bg-codGray text-quillGray dark:bg-bgShades-dark dark:text-quillGray transition-colors duration-300`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
