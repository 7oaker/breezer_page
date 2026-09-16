/**
 * The community numbers, fetched from Appwrite at **build time**.
 *
 * `functions/community-stats` in the app repo writes one public row every Sunday. This
 * reads it once per build and bakes the numbers into the static HTML, so no key ships to
 * the browser, there is no request on page load and nothing moves in the layout.
 *
 * The row carries a rate alongside each time-driven figure, which is what lets a weekly
 * job feed a counter that ticks every day: `src/scripts/community-stats.js` carries days,
 * pouches and money forward from `computedAt` in the visitor's browser.
 *
 * **A failed fetch renders nothing rather than something invented.** There is no
 * committed fallback snapshot: numbers on a public page have to be numbers somebody
 * measured, and a stale hardcoded figure is exactly what this whole mechanism exists to
 * get rid of. The build still succeeds, the band simply does not appear.
 *
 * The ids below are public identifiers, not credentials: the project id ships in the
 * mobile app bundle and the row is world readable on purpose. An Appwrite API key here
 * would be the unsafe version, because Appwrite key scopes are project wide.
 */

/**
 * `process.env` first: Vercel hands build variables to the process, and Vite only lifts
 * prefixed ones onto `import.meta.env`. Anything not prefixed `PUBLIC_` stays server side
 * either way, which is what we want for config that has no business in the bundle.
 */
const env = (key: string, fallback: string): string => {
  const fromProcess = typeof process !== 'undefined' ? process.env?.[key] : undefined;
  return fromProcess || (import.meta.env as Record<string, string | undefined>)[key] || fallback;
};

const ENDPOINT = env('APPWRITE_ENDPOINT', 'https://cloud.appwrite.io/v1');
const PROJECT_ID = env('APPWRITE_PROJECT_ID', '66d453f2003155309653');
const DATABASE_ID = env('APPWRITE_DATABASE_ID', '66d45550003926da0d10');
const COLLECTION_ID = env('APPWRITE_COMMUNITY_STATS_COLLECTION_ID', 'community_stats');

const TIMEOUT_MS = 5000;

export interface CommunityStats {
  /** ISO timestamp the numbers were computed at. The ticker counts from here. */
  computedAt: string;
  members: number;
  pouchesTracked: number;
  chatMessages: number;
  quitters: number;
  daysWithoutSnus: number;
  pouchesAvoided: number;
  moneySaved: number;
  ratePouchesPerDay: number;
  rateMoneyPerDay: number;
}

const num = (value: unknown): number => (Number.isFinite(Number(value)) ? Number(value) : 0);

/**
 * Both routes, because Appwrite renamed collections to tables and which one a project
 * serves depends on how the table was created. The app repo hit exactly this: a row
 * created through the TablesDB API is listable but answers 404 on the legacy document
 * route. Listing is used rather than fetching by id for the same reason.
 */
const ROUTES = [
  `/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`,
  `/tablesdb/${DATABASE_ID}/tables/${COLLECTION_ID}/rows`,
];

async function fetchRow(): Promise<Record<string, unknown> | null> {
  const query = encodeURIComponent(JSON.stringify({ method: 'limit', values: [1] }));

  for (const route of ROUTES) {
    try {
      const res = await fetch(`${ENDPOINT}${route}?queries[]=${query}`, {
        headers: { 'X-Appwrite-Project': PROJECT_ID },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) continue;
      const json = await res.json();
      const row = json?.documents?.[0] || json?.rows?.[0];
      if (row) return row;
    } catch {
      // Next route, and if that fails too the band simply does not render.
    }
  }
  return null;
}

let pending: Promise<CommunityStats | null> | null = null;

/**
 * Memoised: the homepage renders once per locale and the numbers are the same for all of
 * them, so the build makes one request, not one per language.
 */
export function getCommunityStats(): Promise<CommunityStats | null> {
  if (!pending) {
    pending = fetchRow().then((row) => {
      if (!row || !row.computedAt) {
        console.warn('[community-stats] no row, the numbers band will not render');
        return null;
      }
      return {
        computedAt: String(row.computedAt),
        members: num(row.members),
        pouchesTracked: num(row.pouchesTracked),
        chatMessages: num(row.chatMessages),
        quitters: num(row.quitters),
        daysWithoutSnus: num(row.daysWithoutSnus),
        pouchesAvoided: num(row.pouchesAvoided),
        moneySaved: num(row.moneySaved),
        ratePouchesPerDay: num(row.ratePouchesPerDay),
        rateMoneyPerDay: num(row.rateMoneyPerDay),
      };
    });
  }
  return pending;
}

/**
 * Carries the three time-driven numbers forward to `now`. The same arithmetic as
 * `functions/community-stats/aggregate.js` in the app repo, and as the browser ticker:
 * computeQuittingSavings is linear in time, so this is exact for everybody who was
 * already quitting when the row was written.
 */
export function projectStats(stats: CommunityStats, now: number = Date.now()) {
  const computedAt = new Date(stats.computedAt).getTime();
  const days = Number.isFinite(computedAt) ? Math.max(0, (now - computedAt) / 86400000) : 0;
  return {
    daysWithoutSnus: Math.round(stats.daysWithoutSnus + stats.quitters * days),
    pouchesAvoided: Math.round(stats.pouchesAvoided + stats.ratePouchesPerDay * days),
    moneySaved: Math.round(stats.moneySaved + stats.rateMoneyPerDay * days),
  };
}
