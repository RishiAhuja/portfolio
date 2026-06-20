import type { APIRoute } from 'astro';
import { jsonResponse, requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import {
  listBootcampLecturesServer,
  updateBootcampLectureServer,
} from '../../../lib/admin-server';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const data = await listBootcampLecturesServer();
  return jsonResponse({ data });
};

export const POST: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const body = await request.json();

  if (body.action === 'update') {
    const data = await updateBootcampLectureServer(body.id, body.updates);
    if (!data) {
      return jsonResponse({ error: 'Failed to update lecture' }, 500);
    }
    return jsonResponse({ data });
  }

  if (body.action === 'togglePublish') {
    const success = await updateBootcampLectureServer(body.id, {
      is_published: body.isPublished,
    });
    return jsonResponse({ success: Boolean(success) });
  }

  return jsonResponse({ error: 'Invalid action' }, 400);
};
