/**
 * Single source of truth for the EN <-> DE route pairing.
 *
 * Every hreflang tag, language switcher link and sitemap alternate is derived
 * from this map, so a route can never end up pointing at a non-existent
 * translation the way the old string-replacement build could.
 */

export const routePairs = {
  home: { en: '/', de: '/de' },
  snusTracker: { en: '/snus-tracker', de: '/de/snus-tracker' },
  quitSnus: { en: '/quit-snus', de: '/de/snus-aufhoeren' },
  zynTracker: { en: '/zyn-tracker', de: '/de/zyn-tracker' },
  vsSnusless: { en: '/vs-snusless', de: '/de/vs-snusless' },
  vsSmokeFree: { en: '/vs-smoke-free', de: '/de/vs-smoke-free' },
  blog: { en: '/blog', de: '/de/blog' },
  imprint: { en: '/imprint', de: '/de/impressum' },
} as const;

export type RouteKey = keyof typeof routePairs;
export type Lang = 'en' | 'de';

export const route = (key: RouteKey, lang: Lang) => routePairs[key][lang];

/** The counterpart URL for a given route, used for hreflang. */
export const altRoute = (key: RouteKey, lang: Lang) =>
  routePairs[key][lang === 'en' ? 'de' : 'en'];

export const nav: { key: RouteKey; label: Record<Lang, string> }[] = [
  { key: 'snusTracker', label: { en: 'Snus Tracker', de: 'Snus Tracker' } },
  { key: 'quitSnus', label: { en: 'Quit Snus', de: 'Snus aufhören' } },
  { key: 'zynTracker', label: { en: 'Zyn Tracker', de: 'Zyn Tracker' } },
  { key: 'blog', label: { en: 'Blog', de: 'Blog' } },
];

export const footerNav: { key: RouteKey; label: Record<Lang, string> }[] = [
  { key: 'home', label: { en: 'Snus App', de: 'Snus App' } },
  { key: 'snusTracker', label: { en: 'Snus Tracker', de: 'Snus Tracker' } },
  { key: 'quitSnus', label: { en: 'Quit Snus', de: 'Snus aufhören' } },
  { key: 'zynTracker', label: { en: 'Zyn Tracker', de: 'Zyn Tracker' } },
  { key: 'vsSnusless', label: { en: 'Breezer vs Snusless', de: 'Breezer vs Snusless' } },
  { key: 'vsSmokeFree', label: { en: 'Breezer vs Smoke Free', de: 'Breezer vs Smoke Free' } },
  { key: 'blog', label: { en: 'Blog', de: 'Blog' } },
];
