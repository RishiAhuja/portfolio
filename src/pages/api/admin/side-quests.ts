import type { APIRoute } from 'astro';
import { jsonResponse, requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import {
  getSideQuestsWithHistoryServer,
  updateSideQuestServer,
} from '../../../lib/admin-server';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  if (url.searchParams.get('withHistory') === '1') {
    const data = await getSideQuestsWithHistoryServer();
    return jsonResponse({ data });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('side_quests')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return jsonResponse({ error: 'Failed to fetch side quests' }, 500);
  }

  return jsonResponse({ data });
};

export const POST: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const { id, updates } = await request.json();
  const data = await updateSideQuestServer(id, updates);

  if (!data) {
    return jsonResponse({ error: 'Failed to update side quest' }, 500);
  }

  return jsonResponse({ data });
};
