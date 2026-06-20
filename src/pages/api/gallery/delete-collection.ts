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

    // Parse request body
    const { collectionId } = await request.json();
    if (!collectionId) {
      return new Response(JSON.stringify({ error: 'Missing collectionId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = getSupabaseAdmin();

    // Get all images in this collection
    const { data: images } = await supabase
      .from('gallery_images')
      .select('r2_key')
      .eq('collection_id', collectionId);

    // Delete all images from R2
    if (images && images.length > 0) {
      for (const image of images) {
        try {
          await deleteImageFromR2(image.r2_key);
        } catch (error) {
          console.error('Error deleting image from R2:', error);
          // Continue even if R2 deletion fails
        }
      }
    }

    // Delete collection (CASCADE will delete all images from database)
    const { error } = await supabase
      .from('gallery_collections')
      .delete()
      .eq('id', collectionId);

    if (error) {
      console.error('Database error:', error);
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
    console.error('Delete collection error:', error);
    return new Response(JSON.stringify({ error: 'Delete failed', details: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
