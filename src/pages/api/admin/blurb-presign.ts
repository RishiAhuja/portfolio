import type { APIRoute } from 'astro';
import { generateBlurbPresignedUploadUrl } from '../../../lib/r2Storage';
import { requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await requireAdminSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { fileName, contentType, slug } = body as {
      fileName?: string;
      contentType?: string;
      slug?: string;
    };

    if (!fileName || !contentType || !slug) {
      return new Response(JSON.stringify({ error: 'Need a file name, type, and blurb slug.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await generateBlurbPresignedUploadUrl(slug, fileName, contentType);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to prepare the upload.';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
