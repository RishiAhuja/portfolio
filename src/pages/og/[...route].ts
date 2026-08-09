import { ImageResponse } from '@vercel/og';
import type { APIRoute } from 'astro';

export const prerender = false;

const COLORS = {
  background: '#171717',
  text: '#f1f1ed',
  muted: '#a3a39d',
  accent: '#8ecfd6',
  line: '#343434',
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

const TYPE_META: Record<OgType, { label: string; footer: string }> = {
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
  if (title.length > 72) return 50;
  if (title.length > 48) return 58;
  return 68;
};

const resolveType = (type: string): OgType =>
  type in TYPE_META ? (type as OgType) : 'default';

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

  try {
    const html = {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: COLORS.background,
          padding: '68px 76px 58px',
          fontFamily: 'Arial, Helvetica, sans-serif',
        },
        children: [
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
                            width: '12px',
                            height: '12px',
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
                            letterSpacing: '-0.01em',
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
                      color: COLORS.accent,
                      fontSize: '19px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                    },
                    children: meta.label,
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
                flexDirection: 'column',
                gap: '24px',
                width: '100%',
                maxWidth: '1048px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: COLORS.text,
                      fontSize: titleSize(title),
                      fontWeight: 700,
                      lineHeight: 1.08,
                      letterSpacing: '-0.035em',
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
                      lineHeight: 1.4,
                      maxWidth: '930px',
                    },
                    children: truncate(description, 150),
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
                justifyContent: 'space-between',
                width: '100%',
                borderTop: `1px solid ${COLORS.line}`,
                paddingTop: '26px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: COLORS.muted,
                      fontSize: '22px',
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
                    },
                    children: 'rishia.in',
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
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
};
