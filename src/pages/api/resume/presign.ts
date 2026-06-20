import type { APIRoute } from 'astro';
import { generatePresignedResumeUploadUrl } from '../../../lib/r2Storage';
import { requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';

export const prerender = false;

const RESUME_FILE_PATTERN = /^rishi-resume-v\d+\.pdf$/i;

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await requireAdminSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { fileName, contentType } = body as {
      fileName?: string;
      contentType?: string;
    };

    const trimmedFileName = fileName?.trim();
    if (!trimmedFileName || !RESUME_FILE_PATTERN.test(trimmedFileName)) {
      return new Response(JSON.stringify({ error: 'Filename must match rishi-resume-v<number>.pdf' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (contentType && contentType !== 'application/pdf') {
      return new Response(JSON.stringify({ error: 'Only PDF resumes are allowed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await generatePresignedResumeUploadUrl(trimmedFileName, contentType || 'application/pdf');

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Resume presign error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate resume upload URL',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
