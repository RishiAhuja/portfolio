import type { ContentChunk, ContentNodeType, GraphLink, GraphNode } from './types';

const MIN_SEMANTIC_SCORE = 0.52;
const MAX_SEMANTIC_NEIGHBORS = 4;
const MAX_TAG_NEIGHBORS = 2;

/** Ordered type pairs allowed for embedding-based edges (same-type and page pairs excluded). */
const SEMANTIC_PAIR_KEYS = new Set([
  'blurb|blog',
  'blurb|project',
  'blurb|research',
  'blurb|timeline',
  'blog|project',
  'blog|uncompiled',
  'project|timeline',
]);

/** Tags that alone justify a tag edge when shared between two nodes. */
const HIGH_SIGNAL_TAGS = new Set([
  'c++',
  'c',
  'dart',
  'docker',
  'express',
  'firebase',
  'flutter',
  'flutter web',
  'go',
  'hackathon',
  'langflow',
  'ml',
  'ml kit',
  'openai',
  'postgresql',
  'prisma',
  'python',
  'react',
  'rust',
  'typescript',
  'wasm',
  'webassembly',
]);

/** Node types that may participate in embedding-based edges. */
const SEMANTIC_NODE_TYPES = new Set<ContentNodeType>([
  'project',
  'blurb',
  'blog',
  'research',
  'uncompiled',
  'timeline',
]);

/** Node types that may participate in tag-based edges. */
const TAG_NODE_TYPES = new Set<ContentNodeType>(['project', 'blurb', 'research']);

function semanticPairKey(a: ContentNodeType, b: ContentNodeType): string {
  return [a, b].sort().join('|');
}

function allowsSemanticPair(a: ContentNodeType, b: ContentNodeType): boolean {
  if (a === 'page' || b === 'page') return false;
  if (a === b) return false;
  if (a === 'timeline' && b === 'timeline') return false;
  if (!SEMANTIC_NODE_TYPES.has(a) || !SEMANTIC_NODE_TYPES.has(b)) return false;
  return SEMANTIC_PAIR_KEYS.has(semanticPairKey(a, b));
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function sharedTags(a: string[], b: string[]): string[] {
  const setA = new Set(a.map(normalizeTag));
  return b.filter((tag) => setA.has(normalizeTag(tag)));
}

function qualifiesForTagLink(tagsA: string[] | undefined, tagsB: string[] | undefined): boolean {
  if (!tagsA?.length || !tagsB?.length) return false;
  const shared = sharedTags(tagsA, tagsB);
  if (shared.length >= 2) return true;
  return shared.some((tag) => HIGH_SIGNAL_TAGS.has(normalizeTag(tag)));
}

function tagLinkWeight(shared: string[]): number {
  const highSignal = shared.some((tag) => HIGH_SIGNAL_TAGS.has(normalizeTag(tag)));
  if (shared.length >= 3) return 0.78;
  if (shared.length >= 2) return 0.74;
  return highSignal ? 0.7 : 0.68;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function linkKey(source: string, target: string): string {
  return [source, target].sort().join('::');
}

function addLink(
  links: Map<string, GraphLink>,
  source: string,
  target: string,
  weight: number,
  kind: GraphLink['kind'],
) {
  if (source === target) return;
  const key = linkKey(source, target);
  const existing = links.get(key);
  if (!existing || existing.weight < weight) {
    links.set(key, {
      source,
      target,
      weight: Number(weight.toFixed(4)),
      kind,
    });
  }
}

export function buildStructuralLinks(chunks: ContentChunk[]): GraphLink[] {
  const byProjectSlug = new Map<string, ContentChunk>();
  const byBlurbSlug = new Map<string, ContentChunk>();
  const byId = new Map(chunks.map((chunk) => [chunk.id, chunk]));

  for (const chunk of chunks) {
    if (chunk.type === 'project') {
      byProjectSlug.set(chunk.id.replace('project-', ''), chunk);
    }
    if (chunk.type === 'blurb') {
      byBlurbSlug.set(chunk.id.replace('blurb-', ''), chunk);
    }
  }

  const links = new Map<string, GraphLink>();

  for (const chunk of chunks) {
    if (chunk.projectId) {
      const project = byProjectSlug.get(chunk.projectId);
      if (project) addLink(links, chunk.id, project.id, 0.92, 'structural');
    }

    if (chunk.blurbSlug) {
      const blurb = byBlurbSlug.get(chunk.blurbSlug);
      if (blurb) addLink(links, chunk.id, blurb.id, 0.9, 'structural');
    }

    if (chunk.eventId?.startsWith('timeline-')) {
      const eventSlug = chunk.eventId.replace('timeline-', '').replace(/\s+/g, '-').toLowerCase();
      const timeline = byId.get(`timeline-${eventSlug}`);
      if (timeline) addLink(links, chunk.id, timeline.id, 0.88, 'structural');
    }

    for (const linkedId of chunk.linkedIds ?? []) {
      if (byId.has(linkedId)) {
        addLink(links, chunk.id, linkedId, 0.86, 'structural');
      }
    }
  }

  return [...links.values()];
}

/** Link timeline events only when they share the same blurb (not by calendar year). */
export function buildCohortLinks(chunks: ContentChunk[]): GraphLink[] {
  const links = new Map<string, GraphLink>();
  const byBlurbSlug = new Map<string, ContentChunk[]>();

  for (const chunk of chunks) {
    if (chunk.type !== 'timeline' || !chunk.blurbSlug) continue;
    const list = byBlurbSlug.get(chunk.blurbSlug) ?? [];
    list.push(chunk);
    byBlurbSlug.set(chunk.blurbSlug, list);
  }

  for (const group of byBlurbSlug.values()) {
    if (group.length < 2) continue;
    const ordered = [...group].sort((a, b) => a.title.localeCompare(b.title));
    for (let i = 1; i < ordered.length; i += 1) {
      addLink(links, ordered[i - 1].id, ordered[i].id, 0.72, 'cohort');
    }
  }

  return [...links.values()];
}

export function buildTagLinks(chunks: ContentChunk[]): GraphLink[] {
  const links = new Map<string, GraphLink>();
  const tagged = chunks.filter(
    (chunk) => TAG_NODE_TYPES.has(chunk.type) && (chunk.tags?.length ?? 0) > 0,
  );

  for (let i = 0; i < tagged.length; i += 1) {
    const source = tagged[i];
    const sourceTags = source.tags ?? [];

    const neighbors: Array<{ id: string; weight: number }> = [];

    for (let j = 0; j < tagged.length; j += 1) {
      if (i === j) continue;
      const target = tagged[j];
      const targetTags = target.tags ?? [];
      if (!qualifiesForTagLink(sourceTags, targetTags)) continue;

      const shared = sharedTags(sourceTags, targetTags);
      neighbors.push({
        id: target.id,
        weight: tagLinkWeight(shared),
      });
    }

    neighbors
      .sort((a, b) => b.weight - a.weight)
      .slice(0, MAX_TAG_NEIGHBORS)
      .forEach((neighbor) => {
        addLink(links, source.id, neighbor.id, neighbor.weight, 'tag');
      });
  }

  return [...links.values()];
}

export function buildSemanticLinks(
  chunks: ContentChunk[],
  embeddings: Map<string, number[]>,
): GraphLink[] {
  const links = new Map<string, GraphLink>();
  const byId = new Map(chunks.map((chunk) => [chunk.id, chunk]));

  for (let i = 0; i < chunks.length; i += 1) {
    const source = chunks[i];
    if (!SEMANTIC_NODE_TYPES.has(source.type)) continue;
    const sourceEmbedding = embeddings.get(source.id);
    if (!sourceEmbedding) continue;

    const neighbors: Array<{ id: string; score: number }> = [];

    for (let j = 0; j < chunks.length; j += 1) {
      if (i === j) continue;
      const target = chunks[j];
      if (!allowsSemanticPair(source.type, target.type)) continue;
      const targetEmbedding = embeddings.get(target.id);
      if (!targetEmbedding) continue;
      neighbors.push({
        id: target.id,
        score: cosineSimilarity(sourceEmbedding, targetEmbedding),
      });
    }

    neighbors
      .sort((a, b) => b.score - a.score)
      .filter((neighbor) => neighbor.score >= MIN_SEMANTIC_SCORE)
      .slice(0, MAX_SEMANTIC_NEIGHBORS)
      .forEach((neighbor) => {
        const target = byId.get(neighbor.id);
        if (!target) return;
        addLink(links, source.id, neighbor.id, neighbor.score, 'semantic');
      });
  }

  return [...links.values()];
}

export function toGraphNodes(chunks: ContentChunk[]): GraphNode[] {
  return chunks.map((chunk) => ({
    id: chunk.id,
    type: chunk.type,
    title: chunk.title,
    url: chunk.url,
    snippet: chunk.text.slice(0, 220),
    tags: chunk.tags,
  }));
}

export function mergeLinks(...groups: GraphLink[][]): GraphLink[] {
  const merged = new Map<string, GraphLink>();
  for (const group of groups) {
    for (const link of group) {
      const key = linkKey(link.source, link.target);
      const existing = merged.get(key);
      if (!existing || existing.weight < link.weight) {
        merged.set(key, link);
      }
    }
  }
  return [...merged.values()];
}
