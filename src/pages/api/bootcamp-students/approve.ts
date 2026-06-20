import type { APIRoute } from 'astro';
import { requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import { updateBootcampStudentStatusServer } from '../../../lib/admin-server';

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await requireAdminSession(request);
    if (!session) {
      return unauthorizedResponse();
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
    const success = await updateBootcampStudentStatusServer(id, status);

    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Failed to update status' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
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
