import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { routePairs } from '../i18n/routes';

/**
 * Hand-rolled instead of @astrojs/sitemap because the EN and DE slugs differ
 * (/quit-snus <-> /de/snus-aufhoeren). The integration assumes a shared path
 * per locale and therefore emits those two pages with no alternates at all.
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
  /** EN/DE counterpart paths, when a translation genuinely exists. */
  alt?: { en: string; de: string };
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
  const homeAlt = { en: routePairs.home.en, de: routePairs.home.de };
  entries.push({ path: routePairs.home.en, lastmod: iso(new Date()), changefreq: 'weekly', priority: '1.0', alt: homeAlt });
  entries.push({ path: routePairs.home.de, lastmod: iso(new Date()), changefreq: 'weekly', priority: '1.0', alt: homeAlt });

  // Guides — paired through the guide's own translationOf slug.
  for (const g of guides) {
    const d = g.data;
    const self = d.lang === 'en' ? `/${d.slug}` : `/de/${d.slug}`;
    const other = d.lang === 'en' ? `/de/${d.translationOf}` : `/${d.translationOf}`;
    entries.push({
      path: self,
      lastmod: iso(d.updatedDate ?? d.publishDate),
      changefreq: 'monthly',
      priority: '0.9',
      alt: d.lang === 'en' ? { en: self, de: other } : { en: other, de: self },
    });
  }

  // Blog hubs
  const blogAlt = { en: routePairs.blog.en, de: routePairs.blog.de };
  for (const lang of ['en', 'de'] as const) {
    const langPosts = posts.filter((p) => p.data.lang === lang);
    entries.push({
      path: routePairs.blog[lang],
      lastmod: latest(langPosts.map((p) => p.data.updatedDate ?? p.data.publishDate)),
      changefreq: 'weekly',
      priority: '0.8',
      alt: blogAlt,
    });
  }

  // Posts — hreflang only when a counterpart is actually declared.
  for (const p of posts) {
    const d = p.data;
    const slug = p.id.split('/').pop() as string;
    const self = d.lang === 'en' ? `/blog/${slug}` : `/de/blog/${slug}`;
    const other = d.translationOf
      ? d.lang === 'en'
        ? `/de/blog/${d.translationOf}`
        : `/blog/${d.translationOf}`
      : null;
    entries.push({
      path: self,
      lastmod: iso(d.updatedDate ?? d.publishDate),
      changefreq: 'monthly',
      priority: '0.7',
      alt: other ? (d.lang === 'en' ? { en: self, de: other } : { en: other, de: self }) : undefined,
    });
  }

  const body = entries
    .map((e) => {
      const links = e.alt
        ? [
            `    <xhtml:link rel="alternate" hreflang="en" href="${esc(url(e.alt.en))}" />`,
            `    <xhtml:link rel="alternate" hreflang="de-AT" href="${esc(url(e.alt.de))}" />`,
            `    <xhtml:link rel="alternate" hreflang="de" href="${esc(url(e.alt.de))}" />`,
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(url(e.alt.en))}" />`,
          ].join('\n')
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
