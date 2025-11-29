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
    const { eventId } = await request.json();
    if (!eventId) {
      return new Response(JSON.stringify({ error: 'Missing eventId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // First, get all images to delete from R2
    const { data: images } = await supabase
      .from('gallery_images')
      .select('r2_key')
      .eq('event_id', eventId);

    // Delete images from R2
    if (images && images.length > 0) {
      await Promise.all(images.map((img: any) => deleteImageFromR2(img.r2_key)));
    }

    // Delete event (will cascade delete images from database)
    const { error } = await supabase
      .from('gallery_events')
      .delete()
      .eq('id', eventId);

    if (error) {
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Delete event error:', error);
    return new Response(JSON.stringify({ error: 'Delete failed', details: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
