/**
 * Single source of truth for which pages exist in which language.
 *
 * Every hreflang tag, language switcher link, nav entry and sitemap alternate
 * derives from this map, so a route can never end up pointing at a translation
 * that does not exist.
 *
 * Slugs differ per language on purpose: /quit-snus and /de/snus-aufhoeren both
 * carry their market's keyword, and both are already indexed. Never rename one
 * without a 301 in vercel.json.
 */

import { DEFAULT_LOCALE, type Locale, type LocalePaths, localeCodes } from './locales';

export type { Locale, LocalePaths };
/** Historical name for Locale. Kept because most components import it. */
export type Lang = Locale;

/**
 * Absent locale = the page does not exist there, and no hreflang is claimed
 * for it. The legal pages are deliberately English and German only: they earn
 * no impressions, so translating them would add maintenance and nothing else.
 */
export const routes = {
  home: { en: '/', de: '/de', sv: '/sv' },
  snusTracker: { en: '/snus-tracker', de: '/de/snus-tracker' },
  quitSnus: { en: '/quit-snus', de: '/de/snus-aufhoeren', sv: '/sv/sluta-snusa' },
  zynTracker: { en: '/zyn-tracker', de: '/de/zyn-tracker' },
  vsSnusless: { en: '/vs-snusless', de: '/de/vs-snusless' },
  vsSmokeFree: { en: '/vs-smoke-free', de: '/de/vs-smoke-free' },
  blog: { en: '/blog', de: '/de/blog' },
  imprint: { en: '/imprint', de: '/de/impressum' },
} as const satisfies Record<string, LocalePaths>;

export type RouteKey = keyof typeof routes;

/** Retained so existing imports keep working; `routes` is the name to use. */
export const routePairs = routes;

/**
 * The path for a route in a locale, falling back to the default locale when
 * the page does not exist there. That fallback is what lets a Swedish footer
 * link to the English imprint instead of a 404, and it is why `route` must
 * never be used to build an hreflang tag. Use `alternates` for that.
 */
export const route = (key: RouteKey, locale: Locale): string =>
  (routes[key] as LocalePaths)[locale] ?? (routes[key] as LocalePaths)[DEFAULT_LOCALE]!;

/** Only the locales this route genuinely exists in. Safe for hreflang. */
export const alternates = (key: RouteKey): LocalePaths => routes[key];

/** The counterpart in the other language. Two-locale convenience, kept for callers. */
export const altRoute = (key: RouteKey, locale: Locale): string | undefined => {
  const other = localeCodes.find((code) => code !== locale);
  return other ? (routes[key] as LocalePaths)[other] : undefined;
};

/**
 * Labels are a full record rather than a partial one: a route may legitimately
 * be missing in a locale, but an active locale with untranslated navigation is
 * always a mistake, so the compiler should say so.
 *
 * The nav is filtered per locale at render time by `navFor`. A locale that has
 * only some of these pages should not link to the rest in another language:
 * that is the thin-locale pattern where a page presents as Swedish and every
 * link off it is English, and it reads to a crawler exactly as badly as it
 * reads to a visitor.
 */
export const nav: { key: RouteKey; label: Record<Locale, string> }[] = [
  { key: 'snusTracker', label: { sv: 'Snus Tracker', en: 'Snus Tracker', de: 'Snus Tracker' } },
  { key: 'quitSnus', label: { sv: 'Sluta snusa', en: 'Quit Snus', de: 'Snus aufhören' } },
  { key: 'zynTracker', label: { sv: 'Zyn Tracker', en: 'Zyn Tracker', de: 'Zyn Tracker' } },
  { key: 'blog', label: { sv: 'Blogg', en: 'Blog', de: 'Blog' } },
];

/** Only the entries that genuinely exist in this locale. */
export const navFor = (
  items: { key: RouteKey; label: Record<Locale, string> }[],
  locale: Locale
) => items.filter((item) => (routes[item.key] as LocalePaths)[locale]);

export const footerNav: { key: RouteKey; label: Record<Locale, string> }[] = [
  { key: 'home', label: { sv: 'Snus App', en: 'Snus App', de: 'Snus App' } },
  { key: 'snusTracker', label: { sv: 'Snus Tracker', en: 'Snus Tracker', de: 'Snus Tracker' } },
  { key: 'quitSnus', label: { sv: 'Sluta snusa', en: 'Quit Snus', de: 'Snus aufhören' } },
  { key: 'zynTracker', label: { sv: 'Zyn Tracker', en: 'Zyn Tracker', de: 'Zyn Tracker' } },
  { key: 'vsSnusless', label: { sv: 'Breezer vs Snusless', en: 'Breezer vs Snusless', de: 'Breezer vs Snusless' } },
  { key: 'vsSmokeFree', label: { sv: 'Breezer vs Smoke Free', en: 'Breezer vs Smoke Free', de: 'Breezer vs Smoke Free' } },
  { key: 'blog', label: { sv: 'Blogg', en: 'Blog', de: 'Blog' } },
];
