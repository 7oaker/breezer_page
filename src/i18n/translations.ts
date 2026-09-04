/**
 * Groups content entries into translation sets.
 *
 * `translationKey` is a shared group id: every language version of the same
 * page carries the same value. That replaced a `translationOf` field holding
 * the *other* language's slug, which worked only because there were exactly
 * two languages. With three it would have needed a chain (en -> de -> sv -> en)
 * that breaks the moment one link is wrong, and a broken link here does not
 * fail the build, it silently drops a page out of its hreflang cluster.
 *
 * Paths are built from the locale prefix rather than hard-coded, so a new
 * language needs no edit in this file at all.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { locales, type Locale, type LocalePaths } from './locales';

/** /snus-tracker, /de/snus-tracker, /sv/snusraknare … */
export const guidePath = (lang: Locale, slug: string) => `${locales[lang].prefix}/${slug}`;

/** /blog/foo, /de/blog/foo … */
export const postPath = (lang: Locale, slug: string) => `${locales[lang].prefix}/blog/${slug}`;

/** Collection ids are `lang/slug`, so the slug is the last segment. */
export const postSlug = (entry: CollectionEntry<'blog'>) => entry.id.split('/').pop() as string;

const group = <T>(
  entries: T[],
  keyOf: (e: T) => string | undefined,
  langOf: (e: T) => Locale,
  pathOf: (e: T) => string
) => {
  const sets = new Map<string, LocalePaths>();
  for (const entry of entries) {
    const key = keyOf(entry);
    if (!key) continue;
    const set = sets.get(key) ?? {};
    set[langOf(entry)] = pathOf(entry);
    sets.set(key, set);
  }
  return sets;
};

/** translationKey -> the path of every language version that exists. */
export async function guideSets() {
  const guides = await getCollection('guides', (g) => !g.data.draft);
  return group(
    guides,
    (g) => g.data.translationKey,
    (g) => g.data.lang,
    (g) => guidePath(g.data.lang, g.data.slug)
  );
}

export async function postSets() {
  const posts = await getCollection('blog', (p) => !p.data.draft);
  return group(
    posts,
    (p) => p.data.translationKey,
    (p) => p.data.lang,
    (p) => postPath(p.data.lang, postSlug(p))
  );
}

/**
 * The alternates for one entry. Returns the whole set including the entry's own
 * locale: Seo.astro overwrites the current locale from the canonical path
 * anyway, and a set that already contains itself is easier to reason about than
 * one that has to be completed downstream.
 */
export const setFor = (sets: Map<string, LocalePaths>, key: string | undefined): LocalePaths =>
  (key && sets.get(key)) || {};
