import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export const prerender = false;

const MAX_HISTORY = 240;
const DEFAULT_CAMPAIGN = 'caisc';
const PUBLIC_CAMPAIGN = 'pair-ctrl-external-top10-20260811';

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

const normalizeCampaign = (value: unknown) => {
  if (typeof value !== 'string') return DEFAULT_CAMPAIGN;
  const normalized = value.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9._-]{0,79}$/.test(normalized)
    ? normalized
    : DEFAULT_CAMPAIGN;
};

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const campaign = normalizeCampaign(body.campaign);
  if (campaign !== PUBLIC_CAMPAIGN) {
    const expectedToken = import.meta.env.CLUSTER_PROGRESS_TOKEN;
    const token = getBearerToken(request);
    if (!expectedToken || token !== expectedToken) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }
  }

  const now = new Date().toISOString();
  const storageKey = `cluster-progress:${campaign}`;
  const snapshot = {
    received_at: now,
    campaign,
    source: typeof body.source === 'string' ? body.source : 'cluster',
    host: typeof body.host === 'string' ? body.host : null,
    generated_at: typeof body.generated_at === 'string' ? body.generated_at : now,
    done: typeof body.done === 'number' ? body.done : null,
    total: typeof body.total === 'number' ? body.total : null,
    percent: typeof body.percent === 'number' ? body.percent : null,
    running: typeof body.running === 'number' ? body.running : null,
    held: typeof body.held === 'number' ? body.held : null,
    queued: typeof body.queued === 'number' ? body.queued : null,
    eta_label: typeof body.eta_label === 'string' ? body.eta_label : null,
    eta_note: typeof body.eta_note === 'string' ? body.eta_note : null,
    progress_text: typeof body.progress_text === 'string' ? body.progress_text.slice(0, 40000) : '',
  };

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from('upstream_overrides')
    .select('notes')
    .eq('pr_url', storageKey)
    .maybeSingle();

  let history: unknown[] = [];
  if (existing?.notes) {
    try {
      const parsed = JSON.parse(existing.notes);
      if (Array.isArray(parsed?.history)) {
        history = parsed.history;
      }
    } catch {
      history = [];
    }
  }

  history.push(snapshot);
  history = history.slice(-MAX_HISTORY);

  const notes = JSON.stringify({
    latest: snapshot,
    history,
  });

  const { error } = await supabase
    .from('upstream_overrides')
    .upsert(
      {
        pr_url: storageKey,
        item_type: 'issue',
        visible: false,
        state_override: 'open',
        title_override: `Cluster progress: ${campaign}`,
        notes,
        updated_at: now,
      },
      { onConflict: 'pr_url' }
    );

  if (error) {
    console.error('Cluster progress ingest error:', error);
    return jsonResponse({ error: 'Failed to store progress' }, 500);
  }

  return jsonResponse({ ok: true, received_at: now });
};
