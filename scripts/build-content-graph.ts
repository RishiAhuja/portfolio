/**
 * Build the portfolio knowledge graph.
 *
 * Requires OPENAI_API_KEY. Optionally point USE_CHROMA=1 at a local Chroma server
 * (`npx chroma run`) — embeddings still come from OpenAI; Chroma is used for
 * neighbor queries during the build.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import OpenAI from 'openai';
import { ChromaClient } from 'chromadb';
import { loadDotEnv } from './load-env';
import { collectContentChunks } from '../src/lib/graph/collect';
import {
  buildSemanticLinks,
  buildStructuralLinks,
  buildCohortLinks,
  buildTagLinks,
  mergeLinks,
  toGraphNodes,
} from '../src/lib/graph/build-edges';
import type { GraphData } from '../src/lib/graph/types';

const OUTPUT = join(import.meta.dirname, '../public/graph/data.json');
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-large';
const BATCH_SIZE = 64;

async function embedAll(
  openai: OpenAI,
  texts: string[],
): Promise<number[][]> {
  const vectors: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    });
    const ordered = response.data.sort((a, b) => a.index - b.index);
    vectors.push(...ordered.map((item) => item.embedding));
    process.stdout.write(`  embedded ${Math.min(i + BATCH_SIZE, texts.length)}/${texts.length}\r`);
  }

  process.stdout.write('\n');
  return vectors;
}

async function buildWithChroma(
  ids: string[],
  texts: string[],
  embeddings: number[][],
): Promise<void> {
  const chromaUrl = process.env.CHROMA_URL ?? 'http://localhost:8000';
  const client = new ChromaClient({ path: chromaUrl });
  const collectionName = 'rishia-portfolio-graph';

  try {
    await client.deleteCollection({ name: collectionName });
  } catch {
    // collection may not exist yet
  }

  const collection = await client.createCollection({ name: collectionName });
  await collection.add({
    ids,
    embeddings,
    documents: texts,
  });

  console.log(`Chroma collection "${collectionName}" updated at ${chromaUrl}`);
}

async function main() {
  loadDotEnv();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY is required. Set it in .env or your shell.');
    process.exit(1);
  }

  const chunks = await collectContentChunks();
  console.log(`Collected ${chunks.length} content nodes`);

  const openai = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL,
  });
  const embeddings = await embedAll(
    openai,
    chunks.map((chunk) => chunk.text),
  );

  const embeddingMap = new Map<string, number[]>();
  chunks.forEach((chunk, index) => {
    embeddingMap.set(chunk.id, embeddings[index]);
  });

  let usedChroma = false;
  if (process.env.USE_CHROMA === '1') {
    try {
      await buildWithChroma(
        chunks.map((chunk) => chunk.id),
        chunks.map((chunk) => chunk.text),
        embeddings,
      );
      usedChroma = true;
    } catch (error) {
      console.warn('Chroma update skipped:', error instanceof Error ? error.message : error);
    }
  }

  const structural = buildStructuralLinks(chunks);
  const cohort = buildCohortLinks(chunks);
  const tag = buildTagLinks(chunks);
  const semantic = buildSemanticLinks(chunks, embeddingMap);
  const links = mergeLinks(structural, cohort, tag, semantic);

  const graph: GraphData = {
    generatedAt: new Date().toISOString(),
    embeddingModel: EMBEDDING_MODEL,
    usedChroma,
    nodes: toGraphNodes(chunks),
    links,
  };

  mkdirSync(join(import.meta.dirname, '../public/graph'), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(graph, null, 2));

  console.log(`Wrote ${graph.nodes.length} nodes and ${graph.links.length} links → public/graph/data.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
