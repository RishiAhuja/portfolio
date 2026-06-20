import type { APIRoute } from 'astro';
import { jsonResponse, requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import {
  deleteBootcampStudentServer,
  listBootcampStudentsServer,
  updateBootcampStudentStatusServer,
} from '../../../lib/admin-server';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const status = url.searchParams.get('status');
  const data = await listBootcampStudentsServer(
    status === 'pending' || status === 'approved' || status === 'rejected' ? status : undefined
  );

  return jsonResponse({ data });
};

export const POST: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const body = await request.json();

  if (body.action === 'updateStatus') {
    const success = await updateBootcampStudentStatusServer(body.id, body.status);
    return jsonResponse({ success });
  }

  if (body.action === 'delete') {
    const success = await deleteBootcampStudentServer(body.id);
    return jsonResponse({ success });
  }

  return jsonResponse({ error: 'Invalid action' }, 400);
};
