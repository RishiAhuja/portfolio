import type { APIRoute } from 'astro';
import { jsonResponse, requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export const prerender = false;

// Blurb comments on rishia.in arrive as pending (see researcher-portfolio's
// sql/2026-11-18-blurb-likes-comments.sql) and are only shown once approved here.
const STATUSES = ['pending', 'approved', 'rejected'] as const;
type Status = (typeof STATUSES)[number];
const isStatus = (value: unknown): value is Status => STATUSES.includes(value as Status);
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const GET: APIRoute = async ({ request, url }) => {
  if (!(await requireAdminSession(request))) return unauthorizedResponse();
  const status = url.searchParams.get('status') || 'pending';
  if (!isStatus(status)) return jsonResponse({ error: 'Invalid status' }, 400);

  const supabase = getSupabaseAdmin();
  const [{ data, error }, counts] = await Promise.all([
    supabase.from('blurb_comments').select('id, slug, name, body, status, created_at, reviewed_at')
      .eq('status', status).order('created_at', { ascending: false }).limit(200),
    supabase.from('blurb_comments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);
  if (error) return jsonResponse({ error: 'Could not load comments' }, 500);
  return jsonResponse({ comments: data, pending: counts.count ?? 0 });
};

export const POST: APIRoute = async ({ request }) => {
  if (!(await requireAdminSession(request))) return unauthorizedResponse();
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== 'string' || !ID.test(body.id) || !isStatus(body.status)) {
    return jsonResponse({ error: 'Invalid request' }, 400);
  }
  const { error } = await getSupabaseAdmin().from('blurb_comments')
    .update({ status: body.status, reviewed_at: new Date().toISOString() }).eq('id', body.id);
  if (error) return jsonResponse({ error: 'Could not update the comment' }, 500);
  return jsonResponse({ success: true });
};
