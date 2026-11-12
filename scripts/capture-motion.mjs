#!/usr/bin/env node
/**
 * Films the App Store videos (iOS 27 product page header and search results)
 * into react_Breezer/aso/shots/, frame by frame.
 *
 * Needs the dev server (`npm run dev`), Google Chrome and ffmpeg. The page
 * (src/pages/dev/store/[page]/[lang]/motion/[kind].astro) exposes
 * `__frame(t)`, which sets every element for second `t`; this script steps
 * through the loop at a fixed rate and pipes the frames into ffmpeg, so the
 * video is exact whatever the machine's speed.
 *
 *   npm run motion                           everything
 *   npm run motion -- --page default         one page
 *   npm run motion -- --lang de              one language
 *   npm run motion -- --kind header          one format
 *   npm run motion -- --preview              720p previews only, quick to check
 *
 * Output: H.264 High, yuv420p, 30 fps, with a silent stereo track (App Store
 * Connect expects an audio track on app videos; the stores play these muted):
 *
 *   ../react_Breezer/aso/shots/<page>/apple/<lang>/header.mp4, search.mp4
 *   (previews: header-preview.mp4, search-preview.mp4)
 */

import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import { LANGS, MOTIONS, PAGES, hasCopy, urlLang } from '../src/data/storeShots.ts';

const BASE = process.env.DEV_URL ?? 'http://localhost:4321';
const OUT = new URL(process.env.ASO_SHOTS ?? '../../react_Breezer/aso/shots/', import.meta.url).pathname;
const FPS = 30;

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? null : process.argv[i + 1];
};
const only = { page: arg('page'), lang: arg('lang'), kind: arg('kind') };
const preview = process.argv.includes('--preview');

const probe = `${BASE}/dev/store/default/de/motion/header`;
const alive = await fetch(probe).catch(() => null);
if (!alive?.ok) {
  console.error(`${probe} does not answer. Is \`npm run dev\` running?`);
  process.exit(1);
}

/* Frames in as JPEG (quick to grab at 4K, and quality 95 is past what H.264
   keeps anyway), out as one MP4 with a silent track. */
function encoder(file, width) {
  const args = [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
    '-map', '0:v', '-map', '1:a', '-shortest',
    // JPEG frames are full range; video players and App Store Connect expect
    // limited-range BT.709, so convert and tag it explicitly.
    '-vf', `scale=${width ? `${width}:-2` : 'iw:ih'}:flags=lanczos:in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p`,
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-preset', preview ? 'fast' : 'slow', '-crf', preview ? '22' : '14', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', file,
  ];
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) =>
    ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code} for ${file}`)))),
  );
  // Resolves once ffmpeg has taken the frame, so a slow encode holds the capture back.
  const write = (buf) => new Promise((resolve, reject) => ff.stdin.write(buf, (e) => (e ? reject(e) : resolve())));
  return { write, end: async () => (ff.stdin.end(), done) };
}

const browser = await chromium.launch({ channel: 'chrome' });
let count = 0;
try {
  for (const motion of MOTIONS.filter((m) => !only.kind || m.kind === only.kind)) {
    const context = await browser.newContext({
      viewport: { width: motion.width, height: motion.height },
      deviceScaleFactor: preview ? 1 : motion.scale,
    });
    const page = await context.newPage();
    for (const pageId of Object.keys(PAGES).filter((p) => !only.page || p === only.page)) {
      for (const lang of LANGS.filter((l) => (!only.lang || l === only.lang) && hasCopy(l))) {
        const url = `${BASE}/dev/store/${pageId}/${urlLang(lang)}/motion/${motion.kind}`;
        const r = await page.goto(url, { waitUntil: 'networkidle' });
        if (!r?.ok()) throw new Error(`${url} answered ${r?.status()}`);
        await page.waitForSelector('.canvas[data-ready]');
        const duration = await page.evaluate(() => window.__duration);
        const frames = Math.round(duration * FPS);

        const dir = `${OUT}${pageId}/apple/${lang}`;
        await mkdir(dir, { recursive: true });
        const file = `${dir}/${preview ? motion.file.replace('.mp4', '-preview.mp4') : motion.file}`;
        const out = encoder(file, preview ? 1280 : null);
        const started = Date.now();
        for (let f = 0; f < frames; f++) {
          await page.evaluate((t) => window.__frame(t), f / FPS);
          const jpg = await page.screenshot({
            type: 'jpeg',
            quality: 95,
            clip: { x: 0, y: 0, width: motion.width, height: motion.height },
          });
          await out.write(jpg);
        }
        await out.end();
        count++;
        console.log(`  ✓ ${pageId}/apple/${lang}/${motion.kind} ${duration}s, ${frames} frames, ${((Date.now() - started) / 1000).toFixed(0)}s`);
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(`${count} videos to ${OUT}`);
