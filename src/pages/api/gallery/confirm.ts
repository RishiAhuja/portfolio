import type { APIRoute } from 'astro';
import { requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await requireAdminSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const {
      r2Key,
      r2Url,
      collectionId,
      capturedDate,
      description,
      isCover,
      width,
      height,
      fileSize,
      mimeType,
    } = body as {
      r2Key: string;
      r2Url: string;
      collectionId: string;
      capturedDate: string;
      description?: string;
      isCover?: boolean;
      width?: number;
      height?: number;
      fileSize?: number;
      mimeType?: string;
    };

    if (!r2Key || !r2Url || !collectionId || !capturedDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        collection_id: collectionId,
        captured_date: capturedDate,
        description: description || null,
        r2_key: r2Key,
        r2_url: r2Url,
        file_size: fileSize ?? null,
        mime_type: mimeType ?? null,
        width: width ?? null,
        height: height ?? null,
        is_cover: isCover ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving image to database:', error);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (isCover) {
      await supabase
        .from('gallery_collections')
        .update({ cover_image_url: r2Url })
        .eq('id', collectionId);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Confirm upload error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to confirm upload', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
