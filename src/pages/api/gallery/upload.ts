import type { APIRoute } from 'astro';
import { uploadImageToR2, getImageDimensions } from '../../../lib/r2Storage';
import { supabase } from '../../../lib/supabase';
import { verifyAdminSession } from '../../../lib/admin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const eventId = formData.get('eventId') as string;
    const eventSlug = formData.get('eventSlug') as string;
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const sortOrder = parseInt(formData.get('sortOrder') as string || '0');
    const isCover = formData.get('isCover') === 'true';

    if (!file || !eventId || !eventSlug) {
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
      eventSlug,
    });

    // Save to database
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        event_id: eventId,
        title: title || null,
        description: description || null,
        r2_key: uploadResult.key,
        r2_url: uploadResult.url,
        file_size: uploadResult.size,
        mime_type: uploadResult.mimeType,
        width: dimensions.width,
        height: dimensions.height,
        sort_order: sortOrder,
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

    // If this is marked as cover, update the event's cover_image_url
    if (isCover) {
      await supabase
        .from('gallery_events')
        .update({ cover_image_url: uploadResult.url })
        .eq('id', eventId);
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
