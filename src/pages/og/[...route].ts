import { ImageResponse } from '@vercel/og';
import type { APIRoute } from 'astro';

export const prerender = false;

const COLORS = {
  bg: '#191919',
  text: '#e2e2dd',
  muted: '#8a8a84',
  accent: '#64b2bc',
  line: 'rgba(226, 226, 221, 0.12)',
} as const;

const truncate = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;

const titleSize = (title: string) => {
  if (title.length > 70) return 48;
  if (title.length > 48) return 56;
  if (title.length > 28) return 64;
  return 72;
};

const typeLabel = (type: string) => {
  if (type === 'blog') return 'Technical writing';
  if (type === 'project') return 'Project';
  return 'Portfolio';
};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  const title = url.searchParams.get('title') || 'Rishi Ahuja';
  const description =
    url.searchParams.get('description') || 'Full Stack Developer & Designer';
  const type = url.searchParams.get('type') || 'default';

  try {
    const html = {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: COLORS.bg,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          overflow: 'hidden',
        },
        children: [
          // Atmosphere: soft corner wash
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-120px',
                right: '-80px',
                width: '520px',
                height: '520px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(100,178,188,0.14) 0%, rgba(100,178,188,0) 68%)',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '-160px',
                left: '-100px',
                width: '480px',
                height: '480px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(142,207,214,0.08) 0%, rgba(142,207,214,0) 70%)',
              },
            },
          },
          // Subtle vertical rule texture
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '72px',
                width: '1px',
                backgroundColor: COLORS.line,
              },
            },
          },
          // Accent spine
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '10px',
                backgroundColor: COLORS.accent,
              },
            },
          },
          // Content frame
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                width: '100%',
                padding: '64px 72px 56px 88px',
              },
              children: [
                // Top meta row
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
                            color: COLORS.accent,
                            fontSize: '22px',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '28px',
                                  height: '2px',
                                  backgroundColor: COLORS.accent,
                                },
                              },
                            },
                            type.toUpperCase(),
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: COLORS.muted,
                            fontSize: '24px',
                            letterSpacing: '0.04em',
                          },
                          children: 'rishia.in',
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
                      gap: '28px',
                      maxWidth: '980px',
                      marginTop: '24px',
                      marginBottom: '24px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: COLORS.text,
                            fontSize: titleSize(title),
                            fontWeight: 700,
                            lineHeight: 1.12,
                            letterSpacing: '-0.03em',
                          },
                          children: truncate(title, 90),
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            color: COLORS.muted,
                            fontSize: '28px',
                            lineHeight: 1.45,
                            maxWidth: '860px',
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
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: `1px solid ${COLORS.line}`,
                      paddingTop: '28px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  color: COLORS.text,
                                  fontSize: '28px',
                                  fontWeight: 700,
                                  letterSpacing: '-0.01em',
                                },
                                children: 'Rishi Ahuja',
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  color: COLORS.muted,
                                  fontSize: '22px',
                                },
                                children: typeLabel(type),
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
                            gap: '12px',
                            color: COLORS.accent,
                            fontSize: '24px',
                            fontWeight: 600,
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '10px',
                                  height: '10px',
                                  backgroundColor: COLORS.accent,
                                },
                              },
                            },
                            type === 'blog' ? 'Continue reading' : 'rishia.in',
                          ],
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
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
};
