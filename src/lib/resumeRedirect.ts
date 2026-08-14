import type { APIRoute } from 'astro';
import { LINKS } from './constants';
import { getLatestResumeFile, type ResumeTrack } from './r2Storage';
import { SHORT_LINKS } from './shortLinks';
import {
  buildOgRedirectHtml,
  isLinkPreviewBot,
} from './socialRedirect';

const TRACK_REDIRECT = {
  engineering: {
    fallback: LINKS.RESUME_FALLBACK,
    shortLink: SHORT_LINKS.resume,
  },
  research: {
    fallback: LINKS.RESEARCH_RESUME_FALLBACK,
    shortLink: SHORT_LINKS.researchResume,
  },
} as const;

const resolveResumeUrl = async (track: ResumeTrack) => {
  const { fallback } = TRACK_REDIRECT[track];
  let resumeUrl: string = fallback;

  try {
    const latestResume = await getLatestResumeFile(track);
    resumeUrl = latestResume?.url || resumeUrl;
  } catch (error) {
    console.error(`Failed to resolve latest ${track} resume from R2:`, error);
  }

  return resumeUrl;
};

const handleResume = async (
  track: ResumeTrack,
  request: Request,
  includeBody: boolean
) => {
  const resumeUrl = await resolveResumeUrl(track);
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const canonical = `${origin}${requestUrl.pathname}`;
  const options = {
    ...TRACK_REDIRECT[track].shortLink,
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

export const createResumeRoute = (track: ResumeTrack) => {
  const GET: APIRoute = async ({ request }) => handleResume(track, request, true);
  const HEAD: APIRoute = async ({ request }) => handleResume(track, request, false);
  return { GET, HEAD };
};
