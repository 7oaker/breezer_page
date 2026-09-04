/**
 * The locale registry. Single source of truth for every language the site
 * ships in.
 *
 * Adding a language is one entry here plus the things the type system will
 * then demand: UI strings in `ui.ts`, nav labels in `routes.ts`, and route
 * paths for the pages that should exist in it. That failure mode is
 * deliberate. The previous design hard-coded an EN/DE *pair* into the
 * hreflang emitter, the sitemap, the switcher and the pre-paint redirect, so
 * a third language could not be added without editing all five and silently
 * broke if you missed one.
 *
 * A route does not have to exist in every locale. `/imprint` and the privacy
 * pages stay in English and German on purpose: they carry no search value, and
 * a page that does not exist cannot be claimed by a broken hreflang tag.
 * Google discards an entire alternate cluster when one side does not point
 * back, so partial coverage has to be modelled rather than papered over.
 */

export interface LocaleDef {
  /** Path prefix, '' for the default locale. Keep in sync with the routes map. */
  prefix: string;
  /** <html lang>. Regional where we actually target a region. */
  htmlLang: string;
  /**
   * hreflang values to emit for this locale, in order. Austria is the primary
   * German-speaking market, so de-AT is emitted first and plain `de` after it
   * as the catch-all for the rest of the German-language web.
   */
  hreflang: string[];
  /** og:locale. */
  ogLocale: string;
  /** Two-letter label on the language switcher. */
  label: string;
  /** Endonym, shown in the switcher's accessible name. */
  name: string;
  /**
   * Whether this locale has a blog and therefore an RSS feed. Advertising a
   * feed that would be empty is worse than advertising none.
   */
  feed: boolean;
}

export const locales = {
  en: {
    prefix: '',
    htmlLang: 'en',
    hreflang: ['en'],
    ogLocale: 'en_US',
    label: 'EN',
    name: 'English',
    feed: true,
  },
  de: {
    prefix: '/de',
    htmlLang: 'de-AT',
    hreflang: ['de-AT', 'de'],
    ogLocale: 'de_AT',
    label: 'DE',
    name: 'Deutsch',
    feed: true,
  },
  /**
   * Sweden is the largest snus market in the world and the only one besides
   * DACH where Search Console shows native-language demand: seven queries about
   * the withdrawal timeline, every one of them sitting between position 75 and
   * 96 because there was nothing in Swedish to rank. The locale deliberately
   * starts small, with the homepage and the one guide that demand is for,
   * rather than a machine-translated copy of everything.
   */
  sv: {
    prefix: '/sv',
    htmlLang: 'sv',
    hreflang: ['sv'],
    ogLocale: 'sv_SE',
    label: 'SV',
    name: 'Svenska',
    feed: false,
  },
} as const satisfies Record<string, LocaleDef>;

export type Locale = keyof typeof locales;

/**
 * Iteration order for hreflang tags, the switcher and the sitemap. Object key
 * order, so the default locale stays first everywhere.
 */
export const localeCodes = Object.keys(locales) as Locale[];

/** Un-prefixed, already indexed, and the x-default target. */
export const DEFAULT_LOCALE: Locale = 'en';

export const isLocale = (v: string): v is Locale => v in locales;

/** A path per locale. Absent keys mean the page does not exist there. */
export type LocalePaths = Partial<Record<Locale, string>>;

/**
 * The hreflang set for one page: every locale it exists in, plus x-default.
 * Returns nothing below two entries, because a single-locale page must not
 * emit alternates at all.
 */
export function hreflangLinks(paths: LocalePaths): { hreflang: string; path: string }[] {
  const present = localeCodes.filter((code) => paths[code]);
  if (present.length < 2) return [];

  const links = present.flatMap((code) =>
    locales[code].hreflang.map((tag) => ({ hreflang: tag, path: paths[code] as string }))
  );

  // x-default points at the default locale where it exists, otherwise at the
  // first locale that does. Omitting it entirely would leave Google to guess.
  const fallback = paths[DEFAULT_LOCALE] ?? paths[present[0]];
  return [...links, { hreflang: 'x-default', path: fallback as string }];
}
