/**
 * Structural graph only — no OpenAI key required.
 * Run `npm run graph:build` to regenerate with semantic embeddings.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadDotEnv } from './load-env';
import { collectContentChunks } from '../src/lib/graph/collect';
import {
  buildStructuralLinks,
  buildCohortLinks,
  mergeLinks,
  toGraphNodes,
} from '../src/lib/graph/build-edges';
import type { GraphData } from '../src/lib/graph/types';

const OUTPUT = join(import.meta.dirname, '../public/graph/data.json');

loadDotEnv();

const chunks = await collectContentChunks();
const graph: GraphData = {
  generatedAt: new Date().toISOString(),
  usedChroma: false,
  nodes: toGraphNodes(chunks),
  links: mergeLinks(buildStructuralLinks(chunks), buildCohortLinks(chunks)),
};

mkdirSync(join(import.meta.dirname, '../public/graph'), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(graph, null, 2));
console.log(`Wrote structural graph: ${graph.nodes.length} nodes, ${graph.links.length} links`);
