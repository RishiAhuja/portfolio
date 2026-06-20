import type { APIRoute } from 'astro';
import { jsonResponse, requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const { imageId, updates } = await request.json();

  if (!imageId || !updates) {
    return jsonResponse({ error: 'Missing imageId or updates' }, 400);
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('gallery_images')
    .update(updates)
    .eq('id', imageId)
    .select()
    .single();

  if (error) {
    console.error('Error updating gallery image:', error);
    return jsonResponse({ error: 'Database error' }, 500);
  }

  if (updates.is_cover && data) {
    await supabase
      .from('gallery_collections')
      .update({ cover_image_url: data.r2_url })
      .eq('id', data.collection_id);
  }

  return jsonResponse({ data });
};
