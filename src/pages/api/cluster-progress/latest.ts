import type { APIRoute } from 'astro';
import { verifyAdminSession } from '../../../lib/admin';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

const STORAGE_KEY = 'cluster-progress:caisc';

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

const getBearerToken = (request: Request) => {
  const auth = request.headers.get('Authorization') || request.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
};

export const GET: APIRoute = async ({ request }) => {
  const token = getBearerToken(request);
  const session = token ? await verifyAdminSession(token) : null;
  if (!session) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const { data, error } = await supabase
    .from('upstream_overrides')
    .select('notes, updated_at')
    .eq('pr_url', STORAGE_KEY)
    .maybeSingle();

  if (error) {
    console.error('Cluster progress latest error:', error);
    return jsonResponse({ error: 'Failed to fetch progress' }, 500);
  }

  if (!data?.notes) {
    return jsonResponse({ latest: null, history: [] });
  }

  try {
    const parsed = JSON.parse(data.notes);
    return jsonResponse({
      latest: parsed.latest ?? null,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      updated_at: data.updated_at,
    });
  } catch {
    return jsonResponse({ latest: null, history: [], updated_at: data.updated_at });
  }
};
