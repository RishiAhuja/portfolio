import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../.vercel/output', import.meta.url));

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (entry.name !== '.vc-config.json') continue;
    const config = JSON.parse(await readFile(path, 'utf8'));
    if (typeof config.runtime !== 'string' || !/^nodejs\d+\.x$/.test(config.runtime) || config.runtime === 'nodejs22.x') {
      continue;
    }
    const previous = config.runtime;
    config.runtime = 'nodejs22.x';
    await writeFile(path, `${JSON.stringify(config, null, 2)}\n`);
    console.log(`runtime ${previous} -> nodejs22.x (${path})`);
  }
}

await walk(root);
