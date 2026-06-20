import type { APIRoute } from 'astro';
import { jsonResponse, requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const collection = await request.json();

  if (!collection?.slug || !collection?.year || !collection?.display_name) {
    return jsonResponse({ error: 'Missing required fields' }, 400);
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('gallery_collections')
    .insert({
      slug: collection.slug,
      year: collection.year,
      month: collection.month || null,
      display_name: collection.display_name,
      image_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating gallery collection:', error);
    return jsonResponse({ error: 'Database error' }, 500);
  }

  return jsonResponse({ data });
};
