/**
 * Audits the built site. Run after `npm run build`.
 *
 * Checks the things that silently cost impressions and that no unit test would
 * catch, against `dist/` rather than against the source, because the built
 * output is what Google actually sees.
 *
 * Exits non-zero on an error so it can gate a deploy. Warnings are printed and
 * do not fail: some of them are judgement calls, not defects.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';

/** True for a real file in the build. A directory is a route, not an asset. */
const isBuiltFile = (rel) => {
  const full = join('dist', rel.replace(/^\//, ''));
  return existsSync(full) && statSync(full).isFile();
};
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const SITE = 'https://breezer.now';

const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

/** All built HTML files, as site-absolute URL paths. */
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));

/** dist/blog/foo.html -> /blog/foo ; dist/index.html -> / */
const toUrlPath = (file) => {
  const rel = relative(DIST, file).split(sep).join('/');
  const noExt = rel.replace(/\.html$/, '');
  return noExt === 'index' ? '/' : `/${noExt}`;
};

const pages = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  pages.set(toUrlPath(file), { file, html });
}

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? null;
const meta = (html, name) =>
  html.match(new RegExp(`<meta name="${name}" content="([^"]*)"`))?.[1] ?? null;
const prop = (html, p) =>
  html.match(new RegExp(`<meta property="${p}" content="([^"]*)"`))?.[1] ?? null;

const stripOrigin = (url) => (url?.startsWith(SITE) ? url.slice(SITE.length) || '/' : url);

// ---------------------------------------------------------------- per page

const titles = new Map();
const descriptions = new Map();
const hreflangByPage = new Map();
const indexable = new Set();

for (const [path, { html }] of pages) {
  const robots = meta(html, 'robots') ?? '';
  const isNoindex = robots.includes('noindex');
  if (!isNoindex) indexable.add(path);

  // <html lang> drives language detection for Google, screen readers and
  // hyphenation. A page without one is a page Google has to guess about.
  const htmlLang = html.match(/<html[^>]*\slang="([^"]*)"/)?.[1];
  if (!htmlLang) err(path, 'no lang attribute on <html>');
  else if (!/^[a-z]{2}(-[A-Za-z0-9]{2,8})*$/.test(htmlLang)) {
    err(path, `<html lang="${htmlLang}"> is not a valid language tag`);
  }

  // Title
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
  if (!title) err(path, 'no <title>');
  else {
    if (title.length > 60) warn(path, `title ${title.length} chars, over the 60 cap`);
    if (title.length < 15) warn(path, `title only ${title.length} chars`);
    if (!isNoindex) {
      if (titles.has(title)) err(path, `duplicate title, also on ${titles.get(title)}`);
      else titles.set(title, path);
    }
  }

  // Description
  const desc = meta(html, 'description');
  if (!desc) err(path, 'no meta description');
  else {
    if (desc.length > 175) warn(path, `description ${desc.length} chars`);
    if (desc.length < 50) warn(path, `description only ${desc.length} chars`);
    if (!isNoindex) {
      if (descriptions.has(desc)) err(path, `duplicate description, also on ${descriptions.get(desc)}`);
      else descriptions.set(desc, path);
    }
  }

  // Canonical must exist and point at this page
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (!canonical) err(path, 'no canonical');
  else if (stripOrigin(canonical) !== path) {
    err(path, `canonical points at ${stripOrigin(canonical)}`);
  }

  // Exactly one h1
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s === 0) err(path, 'no <h1>');
  else if (h1s > 1) err(path, `${h1s} <h1> elements`);

  // Discover and snippet caps
  if (!isNoindex && !robots.includes('max-image-preview:large')) {
    warn(path, 'no max-image-preview:large, blocks the large Discover card');
  }

  // Open Graph
  for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
    if (!prop(html, p)) warn(path, `missing ${p}`);
  }
  const ogUrl = prop(html, 'og:url');
  if (ogUrl && stripOrigin(ogUrl) !== path) err(path, `og:url points at ${stripOrigin(ogUrl)}`);
  // Relative og:image is the classic reason a share card renders blank.
  const ogImage = prop(html, 'og:image');
  if (ogImage && !/^https?:\/\//.test(ogImage)) err(path, `og:image is not absolute: ${ogImage}`);

  if (!meta(html, 'twitter:card')) warn(path, 'missing twitter:card');

  // Images need dimensions (CLS) and alt (a11y + image search).
  // An empty alt is minified to a bare `alt` attribute, which is valid and is
  // the correct marking for a decorative image, so it only counts as a defect
  // when the image is not also hidden from assistive technology.
  const imgs = html.match(/<img\b[^>]*>/g) ?? [];
  for (const img of imgs) {
    const src = attr(img, 'src');
    const altText = attr(img, 'alt');
    const hasAltAttr = altText !== null || /\salt(?=[\s>])/.test(img);
    const decorative = /aria-hidden="true"/.test(img);
    if (!hasAltAttr) err(path, `<img> without alt: ${src}`);
    else if (!altText && !decorative) {
      warn(path, `<img> has an empty alt but is not aria-hidden: ${src}`);
    }
    if (!attr(img, 'width') || !attr(img, 'height')) {
      warn(path, `<img> without width/height: ${src}`);
    }
  }

  // hreflang set
  const links = [...html.matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)"/g)].map(
    (m) => ({ hreflang: m[1], href: stripOrigin(m[2]) })
  );
  hreflangByPage.set(path, links);

  // JSON-LD must parse
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      err(path, `invalid JSON-LD: ${e.message}`);
    }
  }
}

// ------------------------------------------------------- hreflang integrity

for (const [path, links] of hreflangByPage) {
  if (links.length === 0) continue;

  const nonDefault = links.filter((l) => l.hreflang !== 'x-default');

  // Self-reference: a cluster without one is discarded wholesale by Google.
  if (!nonDefault.some((l) => l.href === path)) {
    err(path, 'hreflang set does not include the page itself');
  }
  if (!links.some((l) => l.hreflang === 'x-default')) {
    warn(path, 'no x-default in the hreflang set');
  }

  for (const l of nonDefault) {
    // Target must exist
    if (!pages.has(l.href)) {
      err(path, `hreflang ${l.hreflang} points at ${l.href}, which is not built`);
      continue;
    }
    // Target must point back, or Google throws away the whole cluster
    const back = hreflangByPage.get(l.href) ?? [];
    if (!back.some((b) => b.href === path)) {
      err(path, `hreflang ${l.hreflang} -> ${l.href} is not reciprocated`);
    }
    // A noindex target in a cluster wastes the signal. The page's own
    // self-reference is not a target, so it is not worth reporting twice.
    if (l.href !== path && !indexable.has(l.href)) {
      warn(path, `hreflang target ${l.href} is noindex`);
    }
  }

  const dupes = nonDefault
    .map((l) => l.hreflang)
    .filter((t, i, a) => a.indexOf(t) !== i);
  if (dupes.length) err(path, `duplicate hreflang values: ${[...new Set(dupes)].join(', ')}`);
}

// ------------------------------------------------------------- links

const internalTargets = new Map(); // path -> inbound count
for (const p of pages.keys()) internalTargets.set(p, 0);

for (const [path, { html }] of pages) {
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  for (const href of new Set(hrefs)) {
    // A file that exists in the build is an asset, not a missing page. A
    // directory of the same name is a route (dist/blog/ next to dist/blog.html),
    // so it must not short-circuit the check or every hub looks like an orphan.
    if (isBuiltFile(href)) continue;
    if (!pages.has(href)) {
      err(path, `internal link to ${href}, which is not built`);
      continue;
    }
    if (href !== path) internalTargets.set(href, (internalTargets.get(href) ?? 0) + 1);
  }
}

for (const [path, inbound] of internalTargets) {
  if (inbound === 0 && indexable.has(path) && path !== '/') {
    warn(path, 'orphan: no internal links point at it');
  }
}

// ------------------------------------------------------------ sitemap

const sitemapFile = join(DIST, 'sitemap.xml');
if (!existsSync(sitemapFile)) {
  err('sitemap.xml', 'not built');
} else {
  const xml = readFileSync(sitemapFile, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => stripOrigin(m[1]));

  for (const loc of locs) {
    if (!pages.has(loc)) err('sitemap.xml', `lists ${loc}, which is not built`);
    else if (!indexable.has(loc)) err('sitemap.xml', `lists ${loc}, which is noindex`);
  }
  const listed = new Set(locs);
  for (const path of indexable) {
    // Utility pages are indexable but deliberately not promoted in the sitemap.
    if (/^\/(imprint|eula|privacy|invite|de\/impressum|404)/.test(path)) continue;
    if (!listed.has(path)) warn('sitemap.xml', `does not list ${path}`);
  }
  const dupes = locs.filter((l, i) => locs.indexOf(l) !== i);
  if (dupes.length) err('sitemap.xml', `duplicate entries: ${[...new Set(dupes)].join(', ')}`);
}

// ------------------------------------------------------------ feeds

for (const feed of walk(DIST).filter((f) => f.endsWith('feed.xml'))) {
  const xml = readFileSync(feed, 'utf8');
  const rel = `/${relative(DIST, feed).split(sep).join('/')}`;
  const links = [...xml.matchAll(/<link>([^<]*)<\/link>/g)].map((m) => stripOrigin(m[1]));
  if (links.length < 2) warn(rel, 'feed has no items');
  for (const l of links) {
    if (!pages.has(l)) err(rel, `feed links to ${l}, which is not built`);
  }
  if (!xml.includes('rel="self"')) warn(rel, 'no atom:link rel="self"');
  // Every page should advertise the feed, or nothing will find it.
  const advertised = [...pages.values()].some((p) => p.html.includes(`${rel}"`));
  if (!advertised) warn(rel, 'no page links to this feed with <link rel="alternate">');
}

// ------------------------------------------------------------ robots.txt

const robotsFile = join(DIST, 'robots.txt');
if (!existsSync(robotsFile)) {
  err('robots.txt', 'missing');
} else {
  const txt = readFileSync(robotsFile, 'utf8');
  if (!txt.includes('Sitemap:')) err('robots.txt', 'does not reference the sitemap');
  if (!/sitemap\.xml/i.test(txt)) err('robots.txt', 'sitemap URL looks wrong');
}

// ------------------------------------------------------------ report

const line = (s) => console.log(s);
line(`\nSEO audit: ${pages.size} pages, ${indexable.size} indexable\n`);

if (errors.length) {
  line(`ERRORS (${errors.length})`);
  for (const e of errors) line(`  ✗ ${e}`);
  line('');
}
if (warnings.length) {
  line(`WARNINGS (${warnings.length})`);
  for (const w of warnings) line(`  · ${w}`);
  line('');
}
if (!errors.length && !warnings.length) line('Clean.\n');

process.exit(errors.length ? 1 : 0);
