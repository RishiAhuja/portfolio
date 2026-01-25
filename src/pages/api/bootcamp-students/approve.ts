import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminToken } from '../../../lib/admin';

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify admin token
    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { id, action } = body;

    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const status = action === 'approve' ? 'approved' : 'rejected';

    const { data, error } = await supabase
      .from('bootcamp_students')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating student status:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update status' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in approve:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
