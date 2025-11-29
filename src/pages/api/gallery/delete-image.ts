import type { APIRoute } from 'astro';
import { deleteImageFromR2 } from '../../../lib/r2Storage';
import { supabase } from '../../../lib/supabase';
import { verifyAdminSession } from '../../../lib/admin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const session = await verifyAdminSession(token);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const { imageId } = await request.json();
    if (!imageId) {
      return new Response(JSON.stringify({ error: 'Missing imageId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get image data
    const { data: image } = await supabase
      .from('gallery_images')
      .select('r2_key, event_id, r2_url')
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

    // If this was the cover image, clear it from the event
    const { data: event } = await supabase
      .from('gallery_events')
      .select('cover_image_url')
      .eq('id', image.event_id)
      .single();

    if (event && event.cover_image_url === image.r2_url) {
      await supabase
        .from('gallery_events')
        .update({ cover_image_url: null })
        .eq('id', image.event_id);
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
