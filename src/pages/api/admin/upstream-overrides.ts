import type { APIRoute } from 'astro';
import { jsonResponse, requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';
import {
  deleteUpstreamOverrideServer,
  listUpstreamOverridesServer,
  upsertUpstreamOverrideServer,
} from '../../../lib/admin-server';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const data = await listUpstreamOverridesServer();
  return jsonResponse({ data });
};

export const POST: APIRoute = async ({ request }) => {
  const session = await requireAdminSession(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const body = await request.json();

  if (body.action === 'upsert') {
    const data = await upsertUpstreamOverrideServer(body.override);
    if (!data) {
      return jsonResponse({ error: 'Failed to save override' }, 500);
    }
    return jsonResponse({ data });
  }

  if (body.action === 'delete') {
    const success = await deleteUpstreamOverrideServer(body.id);
    return jsonResponse({ success });
  }

  return jsonResponse({ error: 'Invalid action' }, 400);
};
