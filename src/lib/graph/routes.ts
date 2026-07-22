import { readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { blurbPosts } from '../../data/blurb';

const ROOT = join(import.meta.dirname, '../..');
const CONTENT_DIR = join(ROOT, 'content');

/** Blog slugs mirrored locally in src/content/blogs (used when collection isn't available). */
export const FALLBACK_BLOG_SLUGS = [
  'towards-the-modern-transformer-architecture',
  'you-dont-know-websockets-yet',
  'go-beneath-the-abstraction-building-interactive-uis-with-fernkit',
  'shamirs-secret-sharing-scheme-and-multi-party-computation',
  'your-hardest-hello-world-text-rasterization-1',
  'bits-of-trust-the-elegance-of-aes',
  'building-rosenblatts-perceptron-from-scratch-a-comprehensive-technical-deep-dive',
  'getting-cracked-at-clean-and-bloc-architecture',
  'getting-started-at-bloc-architecture',
  'resource-management-with-probabilistic-scheduling-in-the-context-of-linux',
  'art',
  'comprehensive-arch-linux-guide',
] as const;

const STATIC_PAGE_PATHS = [
  '/',
  '/ledger',
  '/links',
  '/community',
  '/gallery',
  '/uncompiled',
  '/blogs',
  '/flutter-bootcamp',
  '/archive',
  '/resume',
  '/colophon',
  '/machine',
  '/graph',
  '/stats',
] as const;

const RISHI_SITE = /^https?:\/\/(www\.)?rishia\.in/i;

interface PublishedUncompiledEntry {
  slug: string;
  title: string;
  content: string;
}

async function fetchPublishedUncompiledEntries(): Promise<PublishedUncompiledEntry[]> {
  const supabaseUrl =
    process.env.PUBLIC_SUPABASE_PROXY_URL ||
    process.env.PUBLIC_SUPABASE_URL ||
    '';
  const supabaseAnonKey =
    process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.PUBLIC_SUPABASE_ANON_KEY ||
    '';

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.rpc('get_published_entries');
    if (error || !data) return [];
    return data as PublishedUncompiledEntry[];
  } catch {
    return [];
  }
}

export function normalizeOnSitePath(url: string): string {
  const stripped = url.replace(RISHI_SITE, '').split('?')[0].split('#')[0];
  if (!stripped || stripped === '/') return '/';
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url) && !RISHI_SITE.test(url);
}

function markdownSlugs(folder: string): string[] {
  const dir = join(CONTENT_DIR, folder);
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => basename(name, '.md'));
}

export function buildStaticRouteSet(): Set<string> {
  const routes = new Set<string>(STATIC_PAGE_PATHS);

  for (const slug of markdownSlugs('projects')) {
    routes.add(`/projects/${slug}`);
  }

  for (const slug of markdownSlugs('research')) {
    routes.add(`/rsh/${slug}`);
  }

  for (const post of blurbPosts.filter((item) => item.status === 'published')) {
    routes.add(`/blurb/${post.slug}`);
  }

  const localBlogSlugs = (() => {
    try {
      return markdownSlugs('blogs');
    } catch {
      return [...FALLBACK_BLOG_SLUGS];
    }
  })();

  for (const slug of localBlogSlugs) {
    routes.add(`/blogs/${slug}`);
  }

  return routes;
}

export async function buildValidRouteSet(): Promise<Set<string>> {
  const routes = buildStaticRouteSet();
  const publishedEntries = await fetchPublishedUncompiledEntries();

  for (const entry of publishedEntries) {
    routes.add(`/uncompiled/${entry.slug}`);
  }

  return routes;
}

export async function fetchPublishedUncompiledForGraph(): Promise<PublishedUncompiledEntry[]> {
  return fetchPublishedUncompiledEntries();
}

export function isValidOnSiteRoute(path: string, routes: Set<string>): boolean {
  return routes.has(normalizeOnSitePath(path));
}

/** Pick the best on-site URL for a timeline node, falling back to /ledger. */
export function resolveTimelineUrl(
  link: string | undefined,
  buttonLinks: string[],
  blurbSlug: string | undefined,
  routes: Set<string>,
): string {
  const candidates: string[] = [];

  if (link && !isExternalUrl(link)) {
    candidates.push(normalizeOnSitePath(link));
  } else if (link && RISHI_SITE.test(link)) {
    candidates.push(normalizeOnSitePath(link));
  }

  for (const buttonLink of buttonLinks) {
    if (!isExternalUrl(buttonLink)) {
      candidates.push(normalizeOnSitePath(buttonLink));
    } else if (RISHI_SITE.test(buttonLink)) {
      candidates.push(normalizeOnSitePath(buttonLink));
    }
  }

  if (blurbSlug) {
    candidates.push(`/blurb/${blurbSlug}`);
  }

  for (const candidate of candidates) {
    if (routes.has(candidate)) return candidate;
  }

  return '/ledger';
}
