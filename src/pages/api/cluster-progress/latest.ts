import type { APIRoute } from 'astro';
import { requireAdminSession } from '../../../lib/api-auth';
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

export const GET: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
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
