import { SHORT_LINKS } from '../lib/shortLinks';
import {
  createOgRedirect,
  createOgRedirectHead,
} from '../lib/socialRedirect';

export const prerender = false;
export const GET = createOgRedirect(SHORT_LINKS.github);
export const HEAD = createOgRedirectHead(SHORT_LINKS.github);
