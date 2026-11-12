#!/usr/bin/env node
/**
 * Writes src/i18n/appScreens.ts from the app's own locale files, so the rebuilt
 * app screens (homepage and store images) say exactly what the app says, in all
 * thirteen app languages.
 *
 *   npm run sync:app-screens        (reads ../react_Breezer, or $BREEZER_APP_DIR)
 *
 * Run it after the app's wording changes, and commit the generated file: the
 * production build on Vercel has no react_Breezer next to it, so the site reads
 * the generated file, never the app repo.
 *
 * A few strings have no key in the app because only the website shows them (the
 * screen-reader captions and the demo notification). Those stay hand-written in
 * SITE_ONLY below for the site's languages; every other language gets English
 * there, which is never visible: the store renders the screens with the banner
 * off and the captions are screen-reader text.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const APP_DIR = resolve(process.env.BREEZER_APP_DIR ?? '../react_Breezer');
const OUT = new URL('../src/i18n/appScreens.ts', import.meta.url).pathname;

const LANGS = ['en', 'de', 'it', 'pl', 'sv', 'no', 'cs', 'sk', 'sl', 'hr', 'da', 'fi', 'hu'];

/** Screen key -> app locale key. The app's {{x}} placeholders become {x} for fill(). */
const MAP = {
  app_time_since_last_snus: 'home.tracking.timeSinceLastSnus',
  app_press_hint: 'home.tracking.pressHint',
  app_consum_statistic: 'home.tracking.consumStatistic',
  app_see_more: 'common.seeMore',
  app_overall: 'home.tracking.overall',
  app_cost: 'stats.cost',
  app_time: 'stats.time',
  app_social: 'friends.social',
  app_your_rank: 'home.tracking.yourRank',
  app_your_squad: 'squad.yourSquad',
  app_drops: 'home.tracking.promotions',
  app_breezers_chat: 'home.tracking.breezersChat',
  app_stats_title_day: 'stats.titleDay',
  app_stats_title_week: 'stats.titleWeek',
  app_stats_title_month: 'stats.titleMonth',
  app_stats_title_year: 'stats.titleYear',
  app_stats_total_consumption: 'stats.totalConsumption',
  app_stats_period_daily: 'stats.periodDaily',
  app_stats_period_weekly: 'stats.periodWeekly',
  app_stats_period_monthly: 'stats.periodMonthly',
  app_stats_period_yearly: 'stats.periodYearly',
  app_stats_within_limit: 'stats.withinLimit',
  app_stats_limit_exceeded: 'stats.limitExceeded',
  app_stats_distribution: 'stats.distribution',
  app_stats_share_by_brand: 'stats.shareByBrand',
  app_stats_share_by_strength: 'stats.shareByStrength',
  app_stats_caption_day: 'peakInsights.Day.evening',
  app_stats_caption_week: 'peakInsights.Week.MO',
  app_stats_caption_month: 'peakInsights.Month.mid_month',
  app_stats_caption_year: 'peakInsights.Year.winter',
  app_period_day: 'periods.day',
  app_period_week: 'periods.week',
  app_period_month: 'periods.month',
  app_period_year: 'periods.year',
  app_share_with_friend: 'common.shareWithFriend',
  app_quit_congrats: 'home.quitting.congrats',
  app_quit_snus_free_for: 'home.quitting.snusFreeFor',
  app_quit_days: 'home.quitting.days',
  app_quit_label_year: 'home.quitting.labelYear',
  app_quit_label_month: 'home.quitting.labelMonth',
  app_quit_label_day: 'home.quitting.labelDay',
  app_quit_label_hour: 'home.quitting.labelHour',
  app_quit_label_min: 'home.quitting.labelMin',
  app_quit_label_sec: 'home.quitting.labelSec',
  app_quit_avoided: 'home.quitting.avoided',
  app_quit_saved: 'home.quitting.saved',
  app_quit_gained: 'home.quitting.gained',
  app_quit_health: 'home.quitting.health',
  app_quit_completed: 'home.quitting.completed',
  app_quit_achievements: 'home.quitting.achievements',
  app_quit_unlocked: 'home.quitting.unlocked',
  app_quit_view: 'home.quitting.view',
  app_quit_urge: 'urge.addUrge',
  app_quit_slip: 'health.journal.slipLabel',
  app_quit_journey: 'journey.title',
  app_quit_journey_irritability: 'health.sym1',
  app_quit_journey_nicotine_free: 'health.nicotineFree',
  app_merch_badge: 'lottery.badge',
  app_widget_take: 'widget.take',
  app_widget_now: 'widget.now',
  app_widget_quit_streak: 'widget.quitStreak',
  app_widget_days: 'widget.days',
  app_widget_avoided: 'widget.avoided',
  app_widget_saved: 'widget.saved',
};

/** Only the website shows these; they have no app key. See the header. */
const SITE_ONLY = JSON.parse(readFileSync(new URL('./site-only-strings.json', import.meta.url), 'utf8'));

const read = (lang) => JSON.parse(readFileSync(`${APP_DIR}/locales/${lang}.json`, 'utf8'));
const get = (data, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), data);
const single = (s) => s.replace(/\{\{\s*(\w+)\s*\}\}/g, '{$1}');

/** The push body the demo banner shows, straight from the function that sends it. */
const pushBodies = Object.fromEntries(
  [...readFileSync(`${APP_DIR}/functions/notify-on-snus/index.js`, 'utf8').matchAll(/^\s*(\w\w): \{ body: '([^']*)'/gm)].map((m) => [m[1], m[2]]),
);

const out = {};
for (const lang of LANGS) {
  const data = read(lang);
  const need = (path) => {
    const v = get(data, path);
    if (typeof v !== 'string' || !v.trim()) throw new Error(`${lang}: ${path} is missing in the app's locale`);
    return v;
  };
  const t = { app_lang: lang };
  for (const [key, path] of Object.entries(MAP)) t[key] = single(need(path));
  t.app_quit_congrats = t.app_quit_congrats.replace('{username}', '{name}');

  // Plural forms, picked at render time with Intl.PluralRules(app_lang).
  const forms = {};
  for (const form of ['zero', 'one', 'two', 'few', 'many', 'other']) {
    const v = get(data, `journey.inDays_${form}`);
    if (typeof v === 'string') forms[form] = single(v);
  }
  if (!forms.other) throw new Error(`${lang}: journey.inDays_other is missing`);
  t.app_quit_journey_in_days = forms;

  t.app_merch_title = 'Breezer Shirt';
  t.app_merch_ends = need('lottery.endsIn').replace(/\{\{\s*days\s*\}\}/, '5').replace(/\{\{\s*hours\s*\}\}/, '3');
  t.app_widget_ago = need('widget.timeAgo').replace('{t}', '20min');

  const site = SITE_ONLY[lang] ?? SITE_ONLY.en;
  Object.assign(t, site);
  if (!SITE_ONLY[lang]) {
    if (pushBodies[lang]) t.app_notif_body = pushBodies[lang];
    t.app_press_aria = need('home.tracking.logSnus');
  }
  out[lang] = t;
}

const literal = (v) => (typeof v === 'string' ? JSON.stringify(v) : `{ ${Object.entries(v).map(([k, s]) => `${k}: ${JSON.stringify(s)}`).join(', ')} }`);
const body = LANGS.map((lang) => `  ${lang}: {\n${Object.entries(out[lang]).map(([k, v]) => `    ${k}: ${literal(v)},`).join('\n')}\n  },`).join('\n');

const file = `/**
 * GENERATED by scripts/sync-app-screens.mjs from react_Breezer/locales/*.json.
 * Do not edit by hand: change the app's wording, then run
 * \`npm run sync:app-screens\`.
 *
 * The words on the rebuilt app screens: PressPhone, StatsPhone and QuitPhone on
 * the homepage, and every phone in the store images (src/pages/dev/store/), in
 * all thirteen app languages. \`{period}\`, \`{name}\` and \`{count}\` are filled
 * by \`fill()\` in ui.ts; plural forms are picked with \`plural()\` below.
 */

export const APP_LANGS = ${JSON.stringify(LANGS).replace(/,/g, ', ').replace(/"/g, "'")} as const;
export type AppLang = (typeof APP_LANGS)[number];

export interface AppText {
${Object.entries(out.en).map(([k, v]) => `  ${k}: ${typeof v === 'string' ? 'string' : 'Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }'};`).join('\n')}
}

export const appScreens: Record<AppLang, AppText> = {
${body}
};

/** The screen words for \`lang\`, falling back to English. */
export function appText(lang: string): AppText {
  return appScreens[lang as AppLang] ?? appScreens.en;
}

/** True when \`lang\` is one of the app's languages. */
export function hasAppText(lang: string): boolean {
  return lang in appScreens;
}

/** The plural form of \`forms\` for \`count\` in \`t\`'s language, as i18next would pick it. */
export function plural(t: AppText, forms: AppText['app_quit_journey_in_days'], count: number): string {
  const rule = new Intl.PluralRules(t.app_lang).select(count);
  return forms[rule] ?? forms.other;
}
`;

writeFileSync(OUT, file);
console.log(`appScreens.ts: ${LANGS.length} languages, ${Object.keys(out.en).length} strings each`);
