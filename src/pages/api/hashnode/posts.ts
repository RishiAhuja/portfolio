import type { APIRoute } from 'astro';
import { fetchHashnodePosts } from '../../../lib/hashnode';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const username = url.searchParams.get('username') || 'rishi2220';
  const limitParam = Number(url.searchParams.get('limit') || '50');
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50;

  try {
    const posts = await fetchHashnodePosts(username, limit);

    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Hashnode posts API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Hashnode posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
