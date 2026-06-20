import type { APIRoute } from 'astro';
import { getBearerToken, jsonResponse, unauthorizedResponse } from '../../../lib/api-auth';
import { logoutAdminServer } from '../../../lib/admin-server';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const token = getBearerToken(request);
  if (!token) {
    return unauthorizedResponse();
  }

  const success = await logoutAdminServer(token);
  return jsonResponse({ success });
};
