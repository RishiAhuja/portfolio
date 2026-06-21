import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Load `.env` into process.env for standalone tsx scripts (Astro loads this automatically). */
export function loadDotEnv(): void {
  const envPath = join(import.meta.dirname, '../.env');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, '');

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
