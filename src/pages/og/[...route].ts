import { ImageResponse } from '@vercel/og';
import type { APIRoute } from 'astro';

// Return empty array since we're using this as a dynamic endpoint
export function getStaticPaths() {
  return [];
}

export const GET: APIRoute = async ({ params, request }) => {
  const url = new URL(request.url);
  
  // Get parameters from URL
  const title = url.searchParams.get('title') || 'Rishi Ahuja';
  const description = url.searchParams.get('description') || 'Full Stack Developer & Designer';
  const type = url.searchParams.get('type') || 'default'; // blog, project, default
  
  try {
    const html = {
      type: 'div',
      key: 'root',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#191919',
          padding: '80px',
          fontFamily: 'monospace',
        },
        children: [
          // Top section with type badge
          {
            type: 'div',
            key: 'top',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              },
              children: type !== 'default' ? [{
                type: 'div',
                key: 'badge',
                props: {
                  style: {
                    display: 'flex',
                    padding: '12px 24px',
                    backgroundColor: 'rgba(100, 178, 188, 0.1)',
                    border: '2px solid rgba(100, 178, 188, 0.3)',
                    borderRadius: '4px',
                    color: '#64B2BC',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  },
                  children: type,
                },
              }] : [],
            },
          },
          // Main content
          {
            type: 'div',
            key: 'content',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                maxWidth: '90%',
              },
              children: [
                // Title
                {
                  type: 'div',
                  key: 'title',
                  props: {
                    style: {
                      fontSize: title.length > 50 ? '54px' : '72px',
                      fontWeight: 'bold',
                      color: '#D3D0C9',
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                    },
                    children: title,
                  },
                },
                // Description
                {
                  type: 'div',
                  key: 'desc',
                  props: {
                    style: {
                      fontSize: '32px',
                      color: '#858585',
                      lineHeight: 1.4,
                      maxWidth: '85%',
                    },
                    children: description.length > 120 
                      ? description.substring(0, 120) + '...' 
                      : description,
                  },
                },
              ],
            },
          },
          // Bottom branding
          {
            type: 'div',
            key: 'bottom',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                borderTop: '2px solid rgba(100, 178, 188, 0.2)',
                paddingTop: '32px',
              },
              children: [
                {
                  type: 'div',
                  key: 'author',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    },
                    children: [
                      // Dot indicator
                      {
                        type: 'div',
                        key: 'dot',
                        props: {
                          style: {
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#64B2BC',
                          },
                        },
                      },
                      {
                        type: 'div',
                        key: 'name',
                        props: {
                          style: {
                            fontSize: '28px',
                            color: '#D3D0C9',
                            fontWeight: 'bold',
                          },
                          children: 'Rishi Ahuja',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  key: 'domain',
                  props: {
                    style: {
                      fontSize: '28px',
                      color: '#64B2BC',
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
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
};
