import type { APIRoute } from 'astro';
import { uploadImageToR2, getImageDimensions } from '../../../lib/r2Storage';
import { requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await requireAdminSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const collectionId = formData.get('collectionId') as string;
    const collectionSlug = formData.get('collectionSlug') as string;
    const capturedDate = formData.get('capturedDate') as string;
    const description = formData.get('description') as string | null;
    const isCover = formData.get('isCover') === 'true';

    if (!file || !collectionId || !collectionSlug || !capturedDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get image dimensions
    const dimensions = await getImageDimensions(file);
    
    // Upload to R2
    const uploadResult = await uploadImageToR2({
      file,
      eventSlug: collectionSlug, // R2Storage still uses eventSlug parameter name
    });

    // Save to database
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        collection_id: collectionId,
        captured_date: capturedDate,
        description: description || null,
        r2_key: uploadResult.key,
        r2_url: uploadResult.url,
        file_size: uploadResult.size,
        mime_type: uploadResult.mimeType,
        width: dimensions.width,
        height: dimensions.height,
        is_cover: isCover,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving image to database:', error);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If this is marked as cover, update the collection's cover_image_url
    if (isCover) {
      await supabase
        .from('gallery_collections')
        .update({ cover_image_url: uploadResult.url })
        .eq('id', collectionId);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
