import { LINKS } from '../lib/constants';
import { getLatestResumeFile } from '../lib/r2Storage';
import { SHORT_LINKS } from '../lib/shortLinks';
import {
  buildOgRedirectHtml,
  isLinkPreviewBot,
} from '../lib/socialRedirect';
import type { APIRoute } from 'astro';

export const prerender = false;

const resolveResume = async () => {
  let resumeUrl: string = LINKS.RESUME_FALLBACK;

  try {
    const latestResume = await getLatestResumeFile();
    resumeUrl = latestResume?.url || resumeUrl;
  } catch (error) {
    console.error('Failed to resolve latest resume from R2:', error);
  }

  return resumeUrl;
};

const handleResume = async (request: Request, includeBody: boolean) => {
  const resumeUrl = await resolveResume();
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const canonical = `${origin}${requestUrl.pathname}`;
  const options = {
    ...SHORT_LINKS.resume,
    destination: resumeUrl,
  };

  if (!isLinkPreviewBot(request.headers.get('user-agent'))) {
    return Response.redirect(resumeUrl, 302);
  }

  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=300',
  };

  if (!includeBody) {
    return new Response(null, { status: 200, headers });
  }

  return new Response(buildOgRedirectHtml({ ...options, canonical, origin }), {
    status: 200,
    headers,
  });
};

export const GET: APIRoute = async ({ request }) => handleResume(request, true);
export const HEAD: APIRoute = async ({ request }) => handleResume(request, false);
