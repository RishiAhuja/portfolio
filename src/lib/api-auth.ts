import type { AdminSession } from './admin';
import { verifyAdminSessionServer } from './admin-server';

export const getBearerToken = (request: Request): string | null => {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7).trim();
};

export const requireAdminSession = async (request: Request): Promise<AdminSession | null> => {
  const token = getBearerToken(request);
  if (!token) {
    return null;
  }
  return verifyAdminSessionServer(token);
};

export const unauthorizedResponse = () =>
  new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });

export const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
