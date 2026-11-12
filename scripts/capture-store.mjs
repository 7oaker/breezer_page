#!/usr/bin/env node
/**
 * Photographs the store images into react_Breezer/aso/shots/.
 *
 * Needs the dev server (`npm run dev`) and Google Chrome. Pages, frames,
 * languages and formats come from src/data/storeShots.ts, which Node 24 imports
 * directly (it strips the types; the file has no imports and only erasable type
 * syntax for that reason).
 *
 *   npm run store                          everything that is built
 *   npm run store -- --page default        one page
 *   npm run store -- --lang de             one language
 *   npm run store -- --device iphone       one format
 *   npm run store -- --frame press         one frame
 *
 * Output is PNG without an alpha channel: App Store Connect rejects images with
 * transparency, even when no pixel is transparent.
 *
 *   ../react_Breezer/aso/shots/<page>/<store>/<lang>/<folder>/NN-<frame>.png
 *
 * NN is the frame's position on its page, so a folder uploads in order.
 */

import { mkdir, readdir, rm } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { DEVICES, LANGS, PAGES, PROMOS, hasCopy, urlLang } from '../src/data/storeShots.ts';

// localhost, not 127.0.0.1: astro dev listens on localhost, which on macOS is
// often IPv6 only.
const BASE = process.env.DEV_URL ?? 'http://localhost:4321';
const OUT = new URL(process.env.ASO_SHOTS ?? '../../react_Breezer/aso/shots/', import.meta.url).pathname;

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? null : process.argv[i + 1];
};
const only = { page: arg('page'), lang: arg('lang'), device: arg('device'), frame: arg('frame') };

const probe = `${BASE}/dev/store/default/de/iphone/press`;
const alive = await fetch(probe).catch(() => null);
if (!alive?.ok) {
  console.error(`${probe} does not answer. Is \`npm run dev\` running?`);
  process.exit(1);
}

const browser = await chromium.launch({ channel: 'chrome' }).catch((error) => {
  console.error(`Chrome would not start (${error.message.split('\n')[0]}). Is Google Chrome installed?`);
  process.exit(1);
});

let count = 0;
const missing = new Set();
const noCopy = new Set();
const long = new Set();
try {
  // --device header|search|feature captures only that wide asset, no screenshots.
  for (const device of DEVICES.filter((d) => !only.device || d.id === only.device)) {
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      deviceScaleFactor: device.scale,
      colorScheme: 'dark',
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const W = device.width * device.scale;
    const H = device.height * device.scale;

    for (const [pageId, frames] of Object.entries(PAGES).filter(([p]) => !only.page || p === only.page)) {
      for (const lang of LANGS.filter((l) => !only.lang || l === only.lang)) {
        // No headlines in this language yet: its preview would carry German ones.
        if (!hasCopy(lang)) {
          noCopy.add(lang);
          continue;
        }
        const dir = `${OUT}${pageId}/${device.store}/${lang}/${device.folder}`;
        await mkdir(dir, { recursive: true });
        // A full folder is rebuilt from scratch: a frame that left the page
        // (03-craving when health replaced it) would otherwise stay behind and
        // be uploaded as an extra screenshot. With --frame only that one is redone.
        if (!only.frame) {
          for (const f of await readdir(dir)) if (/^\d\d-.+\.png$/.test(f)) await rm(`${dir}/${f}`);
        }

        for (const [i, frame] of frames.entries()) {
          if (only.frame && frame !== only.frame) continue;
          const url = `${BASE}/dev/store/${pageId}/${urlLang(lang)}/${device.id}/${frame}`;
          const r = await page.goto(url, { waitUntil: 'networkidle' });
          // 404: no screen built for this frame yet. Say so instead of shooting a gap.
          if (r?.status() === 404) {
            missing.add(frame);
            continue;
          }
          if (!r?.ok()) throw new Error(`${url} answered ${r?.status()}`);
          await page.evaluate(() => document.fonts.ready);
          // A headline is meant to fit two lines; report any that wraps to a third.
          const lines = await page.evaluate(() => {
            const h1 = document.querySelector('.title h1');
            if (!h1) return 0;
            const lh = parseFloat(getComputedStyle(h1).lineHeight);
            return Math.round(h1.getBoundingClientRect().height / lh);
          });
          if (lines > 2 && device.id === 'iphone') long.add(`${lang} ${pageId}/${frame} (${lines} lines)`);
          const png = await page.locator('.canvas').screenshot({ type: 'png' });
          const file = `${dir}/${String(i + 1).padStart(2, '0')}-${frame}.png`;
          const out = await sharp(png).flatten({ background: '#161622' }).removeAlpha().png().toFile(file);
          if (out.width !== W || out.height !== H) {
            throw new Error(`${file}: ${out.width} x ${out.height}, expected ${W} x ${H}`);
          }
          count++;
        }
        console.log(`  ✓ ${pageId}/${device.store}/${lang}/${device.folder}`);
      }
    }
    await context.close();
  }

  // The wide assets: iOS 27 header and search results asset, Play feature graphic.
  // Skipped when one screenshot format or frame was asked for.
  for (const promo of PROMOS.filter((p) => !only.frame && (!only.device || only.device === p.kind))) {
    const context = await browser.newContext({
      viewport: { width: promo.width, height: promo.height },
      deviceScaleFactor: promo.scale,
      colorScheme: 'dark',
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    for (const pageId of Object.keys(PAGES).filter((p) => !only.page || p === only.page)) {
      for (const lang of LANGS.filter((l) => !only.lang || l === only.lang)) {
        if (!hasCopy(lang)) {
          noCopy.add(lang);
          continue;
        }
        const url = `${BASE}/dev/store/${pageId}/${urlLang(lang)}/promo/${promo.kind}`;
        const r = await page.goto(url, { waitUntil: 'networkidle' });
        if (!r?.ok()) throw new Error(`${url} answered ${r?.status()}`);
        await page.evaluate(() => document.fonts.ready);
        const png = await page.locator('.canvas').screenshot({ type: 'png' });
        const dir = `${OUT}${pageId}/${promo.store}/${lang}`;
        await mkdir(dir, { recursive: true });
        const [w, h] = promo.out;
        // The feature graphic is drawn at twice its size and scaled down, which
        // keeps the small type sharp; the Apple assets are drawn at their size.
        const out = await sharp(png).resize(w, h).flatten({ background: '#161622' }).removeAlpha().png().toFile(`${dir}/${promo.file}`);
        if (out.width !== w || out.height !== h) throw new Error(`${dir}/${promo.file}: ${out.width} x ${out.height}, expected ${w} x ${h}`);
        count++;
      }
    }
    console.log(`  ✓ ${promo.kind}`);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`${count} images to ${OUT}`);
if (missing.size) console.warn(`· not built yet, skipped: ${[...missing].join(', ')}`);
if (noCopy.size) console.warn(`· no headlines yet, skipped: ${[...noCopy].join(', ')}`);
if (long.size) console.warn(`· headlines on three lines or more (shorten in react_Breezer/aso/screens-copy/):\n    ${[...long].join('\n    ')}`);
