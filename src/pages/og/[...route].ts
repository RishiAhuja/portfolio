import { ImageResponse } from '@vercel/og';
import type { APIRoute } from 'astro';

export const prerender = false;

const COLORS = {
  background: '#141414',
  surface: '#1c1c1c',
  text: '#f3f2ee',
  muted: '#9c9c96',
  accent: '#8ecfd6',
  accentSoft: 'rgba(142, 207, 214, 0.14)',
  line: '#2e2e2e',
} as const;

type OgType =
  | 'default'
  | 'blog'
  | 'project'
  | 'resume'
  | 'linkedin'
  | 'youtube'
  | 'github'
  | 'instagram'
  | 'calendar'
  | 'research';

const TYPE_META: Record<
  OgType,
  { label: string; footer: string }
> = {
  default: { label: 'PORTFOLIO', footer: 'AI researcher & engineer' },
  blog: { label: 'BLOG', footer: 'Technical writing' },
  project: { label: 'PROJECT', footer: 'Selected work' },
  resume: { label: 'RESUME', footer: 'Curriculum vitae' },
  linkedin: { label: 'LINKEDIN', footer: 'Professional profile' },
  youtube: { label: 'YOUTUBE', footer: 'Video & talks' },
  github: { label: 'GITHUB', footer: 'Code & projects' },
  instagram: { label: 'INSTAGRAM', footer: 'Visual updates' },
  calendar: { label: 'CALENDAR', footer: 'Book a conversation' },
  research: { label: 'RESEARCH', footer: 'Papers & preprints' },
};

const truncate = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;

const titleSize = (title: string) => {
  if (title.length > 72) return 48;
  if (title.length > 48) return 56;
  if (title.length > 28) return 64;
  return 72;
};

const resolveType = (type: string): OgType =>
  type in TYPE_META ? (type as OgType) : 'default';

async function loadFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

// fontsource TTF builds — Satori cannot use woff2 from Google Fonts CSS
const FONT_URLS = {
  manrope600:
    'https://cdn.jsdelivr.net/fontsource/fonts/manrope@5.2.5/latin-600-normal.ttf',
  manrope500:
    'https://cdn.jsdelivr.net/fontsource/fonts/manrope@5.2.5/latin-500-normal.ttf',
  newsreader500:
    'https://cdn.jsdelivr.net/fontsource/fonts/newsreader@5.2.6/latin-500-normal.ttf',
} as const;

export const HEAD: APIRoute = async () =>
  new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  const title = url.searchParams.get('title') || 'Rishi Ahuja';
  const description =
    url.searchParams.get('description') ||
    'AI researcher & engineer · trustworthy systems';
  const type = resolveType(url.searchParams.get('type') || 'default');
  const meta = TYPE_META[type];

  const [manropeSemiBold, manropeMedium, newsreader] = await Promise.all([
    loadFont(FONT_URLS.manrope600),
    loadFont(FONT_URLS.manrope500),
    loadFont(FONT_URLS.newsreader500),
  ]);

  const fonts = [
    manropeSemiBold && {
      name: 'Manrope',
      data: manropeSemiBold,
      weight: 600 as const,
      style: 'normal' as const,
    },
    manropeMedium && {
      name: 'Manrope',
      data: manropeMedium,
      weight: 500 as const,
      style: 'normal' as const,
    },
    newsreader && {
      name: 'Newsreader',
      data: newsreader,
      weight: 500 as const,
      style: 'normal' as const,
    },
  ].filter(Boolean) as {
    name: string;
    data: ArrayBuffer;
    weight: 500 | 600;
    style: 'normal';
  }[];

  const titleFont = newsreader ? 'Newsreader' : 'Manrope, Arial, sans-serif';
  const uiFont = manropeSemiBold ? 'Manrope' : 'Arial, Helvetica, sans-serif';

  try {
    const html = {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: COLORS.background,
          fontFamily: uiFont,
        },
        children: [
          // Soft accent glow
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-120px',
                right: '-80px',
                width: '480px',
                height: '480px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${COLORS.accentSoft} 0%, transparent 68%)`,
                display: 'flex',
              },
            },
          },
          // Left accent rail
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '8px',
                backgroundColor: COLORS.accent,
                display: 'flex',
              },
            },
          },
          // Content shell
          {
            type: 'div',
            props: {
              style: {
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '64px 72px 56px 80px',
              },
              children: [
                // Brand row
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '11px',
                                  height: '11px',
                                  borderRadius: '50%',
                                  backgroundColor: COLORS.accent,
                                },
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  color: COLORS.text,
                                  fontSize: '24px',
                                  fontWeight: 600,
                                  letterSpacing: '-0.02em',
                                },
                                children: 'Rishi Ahuja',
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            color: COLORS.accent,
                            fontSize: '16px',
                            fontWeight: 600,
                            letterSpacing: '0.16em',
                            padding: '10px 16px',
                            border: `1px solid ${COLORS.line}`,
                            borderRadius: '999px',
                            backgroundColor: COLORS.surface,
                          },
                          children: meta.label,
                        },
                      },
                    ],
                  },
                },
                // Title block
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '22px',
                      width: '100%',
                      maxWidth: '1020px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: COLORS.text,
                            fontFamily: titleFont,
                            fontSize: titleSize(title),
                            fontWeight: 500,
                            lineHeight: 1.05,
                            letterSpacing: '-0.03em',
                          },
                          children: truncate(title, 92),
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: COLORS.muted,
                            fontSize: '28px',
                            fontWeight: 500,
                            lineHeight: 1.35,
                            maxWidth: '900px',
                          },
                          children: truncate(description, 140),
                        },
                      },
                    ],
                  },
                },
                // Footer
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      borderTop: `1px solid ${COLORS.line}`,
                      paddingTop: '24px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: COLORS.muted,
                            fontSize: '22px',
                            fontWeight: 500,
                          },
                          children: meta.footer,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: COLORS.text,
                            fontSize: '22px',
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                          },
                          children: 'rishia.in',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    };

    return new ImageResponse(html as any, {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
};
