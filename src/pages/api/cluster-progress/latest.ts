import type { APIRoute } from 'astro';
import { requireAdminSession } from '../../../lib/api-auth';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

const DEFAULT_CAMPAIGN = 'caisc';

const normalizeCampaign = (value: string | null) => {
  if (!value) return DEFAULT_CAMPAIGN;
  const normalized = value.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9._-]{0,79}$/.test(normalized)
    ? normalized
    : DEFAULT_CAMPAIGN;
};

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

  const campaign = normalizeCampaign(new URL(request.url).searchParams.get('campaign'));
  const storageKey = `cluster-progress:${campaign}`;

  const { data, error } = await supabase
    .from('upstream_overrides')
    .select('notes, updated_at')
    .eq('pr_url', storageKey)
    .maybeSingle();

  if (error) {
    console.error('Cluster progress latest error:', error);
    return jsonResponse({ error: 'Failed to fetch progress' }, 500);
  }

  if (!data?.notes) {
    return jsonResponse({ campaign, latest: null, history: [] });
  }

  try {
    const parsed = JSON.parse(data.notes);
    return jsonResponse({
      campaign,
      latest: parsed.latest ?? null,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      updated_at: data.updated_at,
    });
  } catch {
    return jsonResponse({ campaign, latest: null, history: [], updated_at: data.updated_at });
  }
};
