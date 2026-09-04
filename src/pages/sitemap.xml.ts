import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { routes } from '../i18n/routes';
import { hreflangLinks, localeCodes, type LocalePaths } from '../i18n/locales';
import { guideSets, postSets, postPath, postSlug, guidePath, setFor } from '../i18n/translations';

/**
 * Hand-rolled instead of @astrojs/sitemap because slugs differ per language
 * (/quit-snus <-> /de/snus-aufhoeren). The integration assumes a shared path
 * per locale and therefore emits those pages with no alternates at all.
 *
 * Driven by src/i18n/routes.ts + the content collections, so a new page or post
 * appears here automatically with a real lastmod.
 */

const SITE = 'https://breezer.now';

interface Entry {
  path: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  /** Counterpart paths per locale, only where a translation genuinely exists. */
  alt?: LocalePaths;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const url = (p: string) => `${SITE}${p === '/' ? '/' : p}`;

export const GET: APIRoute = async () => {
  const guides = await getCollection('guides', (g) => !g.data.draft);
  const posts = await getCollection('blog', (p) => !p.data.draft);

  const latest = (dates: Date[]) =>
    dates.length ? iso(new Date(Math.max(...dates.map((d) => d.valueOf())))) : iso(new Date());

  const entries: Entry[] = [];

  // Homepages
  const homeAlt: LocalePaths = routes.home;
  for (const locale of localeCodes) {
    const path = homeAlt[locale];
    if (!path) continue;
    entries.push({ path, lastmod: iso(new Date()), changefreq: 'weekly', priority: '1.0', alt: homeAlt });
  }

  // Guides — grouped by translationKey, so every language version of a page
  // lists every other one without this file knowing how many there are.
  const guideAlt = await guideSets();
  for (const g of guides) {
    const d = g.data;
    entries.push({
      path: guidePath(d.lang, d.slug),
      lastmod: iso(d.updatedDate ?? d.publishDate),
      changefreq: 'monthly',
      priority: '0.9',
      alt: setFor(guideAlt, d.translationKey),
    });
  }

  // Blog hubs
  const blogAlt: LocalePaths = routes.blog;
  for (const lang of localeCodes) {
    const hub = blogAlt[lang];
    if (!hub) continue;
    const langPosts = posts.filter((p) => p.data.lang === lang);
    entries.push({
      path: hub,
      lastmod: latest(langPosts.map((p) => p.data.updatedDate ?? p.data.publishDate)),
      changefreq: 'weekly',
      priority: '0.8',
      alt: blogAlt,
    });
  }

  // Posts — hreflang only when a counterpart genuinely exists. hreflangLinks
  // drops a set of one, so a single-language post emits no alternates.
  const postAlt = await postSets();
  for (const p of posts) {
    const d = p.data;
    entries.push({
      path: postPath(d.lang, postSlug(p)),
      lastmod: iso(d.updatedDate ?? d.publishDate),
      changefreq: 'monthly',
      priority: '0.7',
      alt: setFor(postAlt, d.translationKey),
    });
  }

  const body = entries
    .map((e) => {
      const alt = e.alt ? hreflangLinks(e.alt) : [];
      const links = alt.length
        ? alt
            .map(
              (l) =>
                `    <xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${esc(url(l.path))}" />`
            )
            .join('\n')
        : null;
      return [
        '  <url>',
        `    <loc>${esc(url(e.path))}</loc>`,
        links,
        `    <lastmod>${e.lastmod}</lastmod>`,
        `    <changefreq>${e.changefreq}</changefreq>`,
        `    <priority>${e.priority}</priority>`,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
