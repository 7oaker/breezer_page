import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { localeCodes, type Locale } from './i18n/locales';

/**
 * Content is authored as Markdown with typed frontmatter. The schema is
 * enforced at build time, so a page missing a description or with an
 * over-long title fails the build instead of silently shipping bad SEO.
 */

const seoFields = {
  /**
   * <title>. Hard-capped at 60 because Google rewrites or truncates beyond
   * roughly 600 pixels, and a rewritten title is one you no longer control.
   * The cap is deliberately the enforcement point rather than a comment: a
   * build that fails is the only review step that never gets skipped.
   */
  title: z.string().min(10).max(60),
  /** <h1>. May differ from the title tag; must carry the target keyword. */
  heading: z.string().min(5),
  /** <meta name="description">. */
  description: z.string().min(50).max(175),
  /** og:description + the card text on listing pages. */
  summary: z.string().min(40).max(200),
  /**
   * Derived from the locale registry, so a new language does not need a second
   * edit here to be authorable.
   */
  lang: z.enum(localeCodes as [Locale, ...Locale[]]),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  /**
   * Rendered as a visible FAQ section AND as FAQPage schema from the same
   * array. Google requires FAQ schema content to be visible on the page, so
   * one source makes that structurally impossible to get wrong.
   */
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  draft: z.boolean().default(false),
};

/** Evergreen landing pages: /snus-tracker, /de/snus-aufhoeren, … */
const guides = defineCollection({
  // Default IDs come from the filename alone, so en/zyn-tracker.md and
  // de/zyn-tracker.md would collide and silently overwrite each other.
  loader: glob({
    base: 'src/content/guides',
    // '!**/_*' keeps authoring templates out of the collection.
    pattern: ['**/*.{md,mdx}', '!**/_*'],
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      ...seoFields,
      /** URL segment, e.g. "snus-tracker". */
      slug: z.string(),
      /** The other language's slug, for hreflang. */
      translationOf: z.string(),
      /** Screenshot shown beside the intro, in the device frame. */
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      /** Extra screenshots rendered as a strip above the FAQ. */
      gallery: z
        .array(z.object({ image: image(), alt: z.string(), caption: z.string().optional() }))
        .optional(),
    }),
});

/** Blog posts: /blog/<slug>, /de/blog/<slug> */
const blog = defineCollection({
  loader: glob({
    base: 'src/content/blog',
    // '!**/_*' keeps authoring templates out of the collection.
    pattern: ['**/*.{md,mdx}', '!**/_*'],
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      ...seoFields,
      /** Slug of the counterpart post in the other language, if it exists. */
      translationOf: z.string().optional(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      gallery: z
        .array(z.object({ image: image(), alt: z.string(), caption: z.string().optional() }))
        .optional(),
      author: z.string().default('Breezer Team'),
    }),
});

export const collections = { guides, blog };
