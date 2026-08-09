import type { APIRoute } from 'astro';

export const createPermanentRedirect = (destination: string): APIRoute => {
  return () => Response.redirect(destination, 301);
};
