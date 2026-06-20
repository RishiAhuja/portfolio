import type { APIRoute } from 'astro';
import { deleteImageFromR2 } from '../../../lib/r2Storage';
import { requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await requireAdminSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const { imageId } = await request.json();
    if (!imageId) {
      return new Response(JSON.stringify({ error: 'Missing imageId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = getSupabaseAdmin();

    // Get image data
    const { data: image } = await supabase
      .from('gallery_images')
      .select('r2_key, collection_id, r2_url')
      .eq('id', imageId)
      .single();

    if (!image) {
      return new Response(JSON.stringify({ error: 'Image not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete from R2
    await deleteImageFromR2(image.r2_key);

    // Delete from database
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If this was the cover image, clear it from the collection
    const { data: collection } = await supabase
      .from('gallery_collections')
      .select('cover_image_url')
      .eq('id', image.collection_id)
      .single();

    if (collection && collection.cover_image_url === image.r2_url) {
      await supabase
        .from('gallery_collections')
        .update({ cover_image_url: null })
        .eq('id', image.collection_id);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Delete error:', error);
    return new Response(JSON.stringify({ error: 'Delete failed', details: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
