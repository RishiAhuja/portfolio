import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { blurbPosts } from '../../data/blurb';
import { timelineData, type TimelineEvent } from '../../data/timeline';
import type { BlurbContent } from '../../data/blurb';
import type { ContentChunk, ContentNodeType } from './types';
import { pathToNodeId } from './resolve-id';
import {
  buildValidRouteSet,
  FALLBACK_BLOG_SLUGS,
  fetchPublishedUncompiledForGraph,
  isValidOnSiteRoute,
  resolveTimelineUrl,
} from './routes';

const ROOT = join(import.meta.dirname, '../..');
const CONTENT_DIR = join(ROOT, 'content');

const FALLBACK_BLOGS: Array<{ title: string; slug: string; brief: string }> = [
  {
    title: "You Don't Know WebSockets Yet",
    slug: 'you-dont-know-websockets-yet',
    brief: 'A deep dive into WebSockets, real-time communication, and what most tutorials skip.',
  },
  {
    title: 'Go Beneath the Abstraction: Building Interactive UIs with FernKit',
    slug: 'go-beneath-the-abstraction-building-interactive-uis-with-fernkit',
    brief: 'Building interactive UIs from scratch with FernKit and low-level graphics.',
  },
  {
    title: "Shamir's Secret Sharing Scheme and Multi-Party Computation",
    slug: 'shamirs-secret-sharing-scheme-and-multi-party-computation',
    brief: 'Cryptography, secret sharing, and MPC explained with practical intuition.',
  },
  {
    title: 'Your Hardest Hello World: Text Rasterization (1)',
    slug: 'your-hardest-hello-world-text-rasterization-1',
    brief: 'Font rasterization, glyph rendering, and the hidden complexity of displaying text.',
  },
  {
    title: 'Bits of Trust: The Elegance of AES',
    slug: 'bits-of-trust-the-elegance-of-aes',
    brief: 'AES block cipher internals and why symmetric encryption still matters.',
  },
  {
    title: "Building Rosenblatt's Perceptron from Scratch",
    slug: 'building-rosenblatts-perceptron-from-scratch-a-comprehensive-technical-deep-dive',
    brief: 'Implementing the perceptron learning algorithm from first principles.',
  },
];

function parseMarkdownFile(filePath: string): { title: string; description: string; body: string; tags: string[] } {
  const raw = readFileSync(filePath, 'utf-8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { title: basename(filePath, '.md'), description: '', body: raw, tags: [] };
  }

  const frontmatter = match[1];
  const body = match[2].trim();
  const title = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? basename(filePath, '.md');
  const description = frontmatter.match(/^description:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? '';
  const techStack = frontmatter.match(/tech_stack:\s*\[([\s\S]*?)\]/m)?.[1];
  const tags = techStack
    ? techStack.split(',').map((item) => item.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
    : [];

  return { title, description, body, tags };
}

function blurbText(content: BlurbContent[]): string {
  return content
    .map((block) => {
      if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote') {
        return block.content ?? '';
      }
      if (block.type === 'list' && block.items) {
        return block.items.join(' ');
      }
      if (block.type === 'linkEmbed') {
        return [block.title, block.description, block.content].filter(Boolean).join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');
}

function timelineLinkedIds(event: TimelineEvent, knownIds: Set<string>): string[] {
  const ids = new Set<string>();

  if (event.blurbSlug) {
    const blurbId = `blurb-${event.blurbSlug}`;
    if (knownIds.has(blurbId)) ids.add(blurbId);
  }

  for (const button of event.buttons ?? []) {
    const nodeId = pathToNodeId(button.link);
    if (nodeId && knownIds.has(nodeId)) ids.add(nodeId);
  }

  if (event.link) {
    const nodeId = pathToNodeId(event.link);
    if (nodeId && knownIds.has(nodeId)) ids.add(nodeId);
  }

  return [...ids];
}

function blurbLinkedIds(post: (typeof blurbPosts)[number], knownIds: Set<string>): string[] {
  const ids = new Set<string>();
  if (post.projectId) {
    const projectId = `project-${post.projectId}`;
    if (knownIds.has(projectId)) ids.add(projectId);
  }
  if (post.relatedPosts) {
    for (const relatedId of post.relatedPosts) {
      const related = blurbPosts.find((item) => item.id === relatedId);
      if (related) {
        const blurbId = `blurb-${related.slug}`;
        if (knownIds.has(blurbId)) ids.add(blurbId);
      }
    }
  }
  return [...ids];
}

function clip(text: string, max = 1200): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return normalized.length <= max ? normalized : `${normalized.slice(0, max)}…`;
}

function chunk(
  type: ContentNodeType,
  slug: string,
  title: string,
  url: string,
  parts: string[],
  extra?: Partial<ContentChunk>,
): ContentChunk {
  const text = clip(parts.filter(Boolean).join('\n\n'));
  return {
    id: `${type}-${slug}`,
    type,
    title,
    url,
    text,
    ...extra,
  };
}

function readMarkdownCollection(
  folder: string,
  type: ContentNodeType,
  urlPrefix: string,
): ContentChunk[] {
  const dir = join(CONTENT_DIR, folder);
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const slug = basename(name, '.md');
      const parsed = parseMarkdownFile(join(dir, name));
      return chunk(type, slug, parsed.title, `${urlPrefix}/${slug}`, [
        parsed.title,
        parsed.description,
        parsed.body,
      ], { tags: parsed.tags });
    });
}

function finalizeChunks(chunks: ContentChunk[], routes: Set<string>): ContentChunk[] {
  const withValidUrls = chunks.filter((item) => isValidOnSiteRoute(item.url, routes));

  const knownIds = new Set(withValidUrls.map((item) => item.id));

  const linked = withValidUrls.map((item) => {
    if (!item.linkedIds?.length) return item;
    const linkedIds = item.linkedIds.filter((id) => knownIds.has(id));
    return linkedIds.length === item.linkedIds.length
      ? item
      : { ...item, linkedIds };
  });

  const seen = new Set<string>();
  return linked.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return item.text.length > 0;
  });
}

export async function collectContentChunks(): Promise<ContentChunk[]> {
  const routes = await buildValidRouteSet();
  const publishedUncompiled = await fetchPublishedUncompiledForGraph();
  const chunks: ContentChunk[] = [];

  chunks.push(
    chunk('page', 'home', 'Home', '/', [
      'Rishi Ahuja portfolio — engineer, builder, open source, ledger, blurbs, projects.',
    ]),
    chunk('page', 'ledger', 'Ledger', '/ledger', [
      'Life timeline of projects, achievements, internships, community work, and milestones.',
    ]),
    chunk('page', 'links', 'Links', '/links', [
      'Contact links, resume, social profiles, blog, and professional presence.',
    ]),
    chunk('page', 'community', 'Community', '/community', [
      'Community work, bootcamp, teaching, and outreach.',
    ]),
    chunk('page', 'gallery', 'Artifacts', '/gallery', [
      'Photo gallery and artifacts from events, travel, and projects.',
    ]),
    chunk('page', 'uncompiled', 'Uncompiled', '/uncompiled', [
      'Philosophical writings on ambition, ego, and building — raw notes from a Stoic builder.',
    ]),
  );

  chunks.push(...readMarkdownCollection('projects', 'project', '/projects'));
  chunks.push(...readMarkdownCollection('research', 'research', '/rsh'));

  for (const post of blurbPosts.filter((item) => item.status === 'published')) {
    chunks.push(
      chunk('blurb', post.slug, post.title, `/blurb/${post.slug}`, [
        post.title,
        post.subtitle ?? '',
        post.description,
        blurbText(post.content),
      ], {
        tags: post.tags,
        projectId: post.projectId,
        eventId: post.eventId,
        category: post.category,
      }),
    );
  }

  if (publishedUncompiled.length > 0) {
    for (const entry of publishedUncompiled) {
      chunks.push(
        chunk('uncompiled', entry.slug, entry.title, `/uncompiled/${entry.slug}`, [
          entry.title,
          entry.content,
        ]),
      );
    }
  }

  for (const blogs of FALLBACK_BLOGS.filter((item) =>
    (FALLBACK_BLOG_SLUGS as readonly string[]).includes(item.slug),
  )) {
    chunks.push(
      chunk('blog', blogs.slug, blogs.title, `/blogs/${blogs.slug}`, [
        blogs.title,
        blogs.brief,
      ]),
    );
  }

  for (const events of Object.values(timelineData)) {
    for (const event of events) {
      const slug = event.date.replace(/\s+/g, '-').toLowerCase();
      const buttonLinks = (event.buttons ?? []).map((button) => button.link);
      const url = resolveTimelineUrl(event.link, buttonLinks, event.blurbSlug, routes);

      chunks.push(
        chunk('timeline', slug, event.title, url, [
          event.title,
          event.description,
          event.type,
          event.year,
        ], {
          blurbSlug: event.blurbSlug,
          year: event.year,
        }),
      );
    }
  }

  const knownIds = new Set(chunks.map((item) => item.id));

  const withLinks = chunks.map((item) => {
    if (item.type === 'blurb') {
      const post = blurbPosts.find((entry) => entry.slug === item.id.replace('blurb-', ''));
      if (!post) return item;
      return { ...item, linkedIds: blurbLinkedIds(post, knownIds) };
    }

    if (item.type === 'timeline') {
      const event = Object.values(timelineData)
        .flat()
        .find((entry) => entry.date.replace(/\s+/g, '-').toLowerCase() === item.id.replace('timeline-', ''));
      if (!event) return item;
      return { ...item, linkedIds: timelineLinkedIds(event, knownIds) };
    }

    return item;
  });

  return finalizeChunks(withLinks, routes);
}
