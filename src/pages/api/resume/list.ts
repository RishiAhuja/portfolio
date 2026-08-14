import type { APIRoute } from 'astro';
import { isResumeTrack, listResumeFiles, type ResumeTrack } from '../../../lib/r2Storage';
import { requireAdminSession, unauthorizedResponse } from '../../../lib/api-auth';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const session = await requireAdminSession(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const trackParam = new URL(request.url).searchParams.get('track');
    const track: ResumeTrack = isResumeTrack(trackParam) ? trackParam : 'engineering';
    const resumes = await listResumeFiles(track);

    return new Response(JSON.stringify({ resumes, latest: resumes[0] || null, track }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Resume list error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to list resumes',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
