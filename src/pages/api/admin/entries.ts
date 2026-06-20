import type { APIRoute } from 'astro';
import { jsonResponse, requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import {
  createUncompiledEntryServer,
  deleteUncompiledEntryServer,
  listUncompiledEntriesServer,
  updateUncompiledEntryServer,
} from '../../../lib/admin-server';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const data = await listUncompiledEntriesServer();
  return jsonResponse({ data });
};

export const POST: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const { action } = body;

  if (action === 'create') {
    const data = await createUncompiledEntryServer(body.entry);
    if (!data) {
      return jsonResponse({ error: 'Failed to create entry' }, 500);
    }
    return jsonResponse({ data });
  }

  if (action === 'update') {
    const data = await updateUncompiledEntryServer(body.id, body.updates);
    if (!data) {
      return jsonResponse({ error: 'Failed to update entry' }, 500);
    }
    return jsonResponse({ data });
  }

  if (action === 'delete') {
    const success = await deleteUncompiledEntryServer(body.id);
    return jsonResponse({ success });
  }

  if (action === 'togglePublish') {
    const success = await updateUncompiledEntryServer(body.id, {
      published: body.published,
    });
    return jsonResponse({ success: Boolean(success) });
  }

  return jsonResponse({ error: 'Invalid action' }, 400);
};
