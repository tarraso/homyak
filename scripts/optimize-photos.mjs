#!/usr/bin/env node
/**
 * Reads originals from ./photos-source/, writes resized JPEGs to
 * ./public/photos/, and prints a TypeScript-ready photos array to stdout.
 *
 * Resizes to MAX_EDGE on the long edge, quality QUALITY mozjpeg.
 * Skips files whose output already exists and is newer than the source
 * (so re-runs are cheap; pass --force to override).
 */
import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve('photos-source');
const OUT = path.resolve('public/photos');
const MAX_EDGE = 2400;
const QUALITY = 82;
const FORCE = process.argv.includes('--force');

const EXTS = new Set(['.jpg', '.jpeg', '.png']);

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const isStale = async (src, dst) => {
  if (FORCE || !existsSync(dst)) return true;
  const [s, d] = await Promise.all([stat(src), stat(dst)]);
  return s.mtimeMs > d.mtimeMs;
};

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC))
  .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
  .sort();

const results = [];
let processed = 0;
let skipped = 0;

for (const file of files) {
  const srcPath = path.join(SRC, file);
  const outName = `${slug(file)}.jpg`;
  const outPath = path.join(OUT, outName);

  if (await isStale(srcPath, outPath)) {
    await sharp(srcPath)
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
      .toFile(outPath);
    processed++;
  } else {
    skipped++;
  }

  const meta = await sharp(outPath).metadata();
  results.push({ file: outName, width: meta.width, height: meta.height });
}

console.error(`✓ ${processed} processed, ${skipped} unchanged → public/photos/`);
console.error('');
console.error('Paste into src/data/photos.ts (edit alt text + add hero: true to one):');
console.error('');

const lines = results.map(
  ({ file, width, height }) =>
    `  { src: '/photos/${file}', alt: 'TODO', width: ${width}, height: ${height} },`,
);
console.log('export const photos: Photo[] = [');
console.log(lines.join('\n'));
console.log('];');
