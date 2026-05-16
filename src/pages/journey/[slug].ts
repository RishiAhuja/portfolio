import type { APIRoute } from 'astro';

export const prerender = false;

const redirectToBlurb: APIRoute = ({ params, request }) => {
  const slug = params.slug;
  return Response.redirect(new URL(`/blurb/${slug}`, request.url), 301);
};

export const GET = redirectToBlurb;
export const HEAD = redirectToBlurb;
