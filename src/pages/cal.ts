import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  return Response.redirect('https://cal.com/rishi2220', 301);
};
