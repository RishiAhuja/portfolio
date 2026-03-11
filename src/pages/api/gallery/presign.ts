import type { APIRoute } from 'astro';
import { generatePresignedUploadUrl } from '../../../lib/r2Storage';
import { verifyAdminSession } from '../../../lib/admin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.substring(7);
    const session = await verifyAdminSession(token);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { fileName, contentType, collectionSlug } = body as {
      fileName: string;
      contentType: string;
      collectionSlug: string;
    };

    if (!fileName || !contentType || !collectionSlug) {
      return new Response(JSON.stringify({ error: 'Missing required fields: fileName, contentType, collectionSlug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await generatePresignedUploadUrl(collectionSlug, fileName, contentType);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Presign error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate presigned URL', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
