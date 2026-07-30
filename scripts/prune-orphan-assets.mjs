/**
 * Removes unreferenced files from dist/_astro/.
 *
 * Declaring an image in a content-collection schema via `image()` makes Astro
 * emit the untouched original next to the optimised variants, even when the
 * page only ever renders it through <Image>. With full-resolution phone
 * screenshots that is ~9.6 MB of files nothing links to.
 *
 * This only deletes files whose hashed basename appears nowhere in any built
 * HTML/CSS/JS/JSON/XML — so it can never remove something in use. Anything it
 * would delete is printed, and the build fails loudly if dist/ is missing.
 */

import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const ASSETS = path.join(DIST, '_astro');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

try {
  await stat(ASSETS);
} catch {
  console.error(`prune: ${ASSETS} not found — run the build first.`);
  process.exit(1);
}

const all = await walk(DIST);
const assets = all.filter((f) => f.startsWith(ASSETS + path.sep));

// Everything that could possibly reference an asset.
const referrers = all.filter((f) => /\.(html|css|js|mjs|json|xml|txt|webmanifest)$/i.test(f));
const haystack = (await Promise.all(referrers.map((f) => readFile(f, 'utf8')))).join('\n');

let freed = 0;
const removed = [];

for (const file of assets) {
  const base = path.basename(file);
  if (haystack.includes(base)) continue;
  const { size } = await stat(file);
  await unlink(file);
  freed += size;
  removed.push(`${base} (${(size / 1024).toFixed(0)} KB)`);
}

if (removed.length === 0) {
  console.log('prune: no orphaned assets');
} else {
  for (const r of removed) console.log(`  removed ${r}`);
  console.log(`prune: ${removed.length} orphaned asset(s), ${(freed / 1024 / 1024).toFixed(1)} MB freed`);
}
