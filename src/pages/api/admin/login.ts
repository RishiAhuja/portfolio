import type { APIRoute } from 'astro';
import { jsonResponse } from '../../../lib/api-auth';
import { loginAdminServer } from '../../../lib/admin-server';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return jsonResponse({ error: 'Email and password are required' }, 400);
    }

    const result = await loginAdminServer(email, password);
    if (!result) {
      return jsonResponse({ error: 'Invalid email or password' }, 401);
    }

    return jsonResponse(result);
  } catch (error) {
    console.error('Admin login error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
};
