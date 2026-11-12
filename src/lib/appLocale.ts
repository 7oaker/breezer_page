/**
 * The app's own words for the store-only screens (journey, craving help, chat,
 * rankings, squads, games, merch), read straight from react_Breezer/locales at
 * render time.
 *
 * Dev server only: the store routes are the only callers, and they do not exist
 * in a production build, where react_Breezer is not next to this repo. The
 * homepage screens use the generated src/i18n/appScreens.ts instead.
 *
 * `tr('journey.inDays', { count: 6 })` resolves like i18next does: the plural
 * form for `count` in that language, then `{{x}}` filled in. A key that does not
 * exist throws, so a store image can never show a raw key or an English fallback.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const APP_DIR = resolve(process.env.BREEZER_APP_DIR ?? '../react_Breezer');

type Vars = Record<string, string | number>;
export type Tr = (key: string, vars?: Vars) => string;

const cache = new Map<string, Record<string, unknown>>();

function load(lang: string): Record<string, unknown> {
  if (!cache.has(lang)) {
    cache.set(lang, JSON.parse(readFileSync(`${APP_DIR}/locales/${lang}.json`, 'utf8')));
  }
  return cache.get(lang)!;
}

function get(data: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), data);
}

export function appLocale(lang: string): Tr {
  const data = load(lang);
  const rules = new Intl.PluralRules(lang);
  return (key, vars = {}) => {
    let value = get(data, key);
    if (value === undefined && typeof vars.count === 'number') {
      value = get(data, `${key}_${rules.select(vars.count)}`) ?? get(data, `${key}_other`);
    }
    if (typeof value !== 'string') throw new Error(`${lang}: no app string "${key}"`);
    return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, name) => (name in vars ? String(vars[name]) : m));
  };
}

/** A date in the language's own words, e.g. "Mittwoch, 11. November". */
export function longDate(lang: string, date: Date): string {
  return new Intl.DateTimeFormat(lang, { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
}
