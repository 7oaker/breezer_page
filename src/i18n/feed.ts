/**
 * RSS 2.0 for the blog, one feed per language.
 *
 * Worth having for two reasons that are not "some people still use readers":
 * a feed is the cheapest way for an aggregator or an agent to discover that
 * something new exists without crawling the whole site, and it is the only
 * surface here that is machine-first by design. Discovery happens through
 * <link rel="alternate"> in the page head rather than through robots.txt,
 * because a feed is not a sitemap and listing it as one just muddies both.
 */

import { getCollection } from 'astro:content';
import { locales, type Locale } from './locales';
import { postPath, postSlug } from './translations';

const SITE = 'https://breezer.now';

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const TITLES: Record<Locale, string> = {
  en: 'Breezer Blog',
  de: 'Breezer Blog',
};

const DESCRIPTIONS: Record<Locale, string> = {
  en: 'Evidence on nicotine pouches: what the research establishes, what it does not, and how to cut down or stop.',
  de: 'Studienlage zu Nikotinbeuteln: was belegt ist, was nicht, und wie Reduzieren oder Aufhören tatsächlich funktioniert.',
};

export async function feed(lang: Locale): Promise<Response> {
  const posts = (await getCollection('blog', (p) => p.data.lang === lang && !p.data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );

  const self = `${SITE}${locales[lang].prefix}/feed.xml`;
  const items = posts
    .map((p) => {
      const d = p.data;
      const url = `${SITE}${postPath(lang, postSlug(p))}`;
      return [
        '    <item>',
        `      <title>${esc(d.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${esc(d.summary)}</description>`,
        `      <pubDate>${(d.updatedDate ?? d.publishDate).toUTCString()}</pubDate>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(TITLES[lang])}</title>
    <link>${SITE}${locales[lang].prefix}/blog</link>
    <description>${esc(DESCRIPTIONS[lang])}</description>
    <language>${locales[lang].htmlLang}</language>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
