import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const eventId = url.searchParams.get('eventId');
  
  if (!eventId) {
    return new Response(JSON.stringify({ error: 'Event ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { data: images, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('event_id', eventId)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching images:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch images' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(images || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
