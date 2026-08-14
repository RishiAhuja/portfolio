import type { APIRoute } from 'astro';
import {
  generatePresignedResumeUploadUrl,
  isResumeTrack,
  RESUME_TRACKS,
  type ResumeTrack,
} from '../../../lib/r2Storage';
import { requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await requireAdminSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { fileName, contentType, track: rawTrack } = body as {
      fileName?: string;
      contentType?: string;
      track?: string;
    };

    const track: ResumeTrack = isResumeTrack(rawTrack) ? rawTrack : 'engineering';
    const trimmedFileName = fileName?.trim();
    if (!trimmedFileName || !RESUME_TRACKS[track].pattern.test(trimmedFileName)) {
      return new Response(
        JSON.stringify({ error: `Filename must match ${RESUME_TRACKS[track].hint}` }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (contentType && contentType !== 'application/pdf') {
      return new Response(JSON.stringify({ error: 'Only PDF resumes are allowed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await generatePresignedResumeUploadUrl(
      trimmedFileName,
      contentType || 'application/pdf',
      300,
      track
    );

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
