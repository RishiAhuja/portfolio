import { LINKS } from '../lib/constants';
import { createPermanentRedirect } from '../lib/socialRedirect';

export const prerender = false;
export const GET = createPermanentRedirect(LINKS.LINKEDIN);
