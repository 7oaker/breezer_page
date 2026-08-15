/**
 * PostHog for breezer.now, deliberately cookieless.
 *
 * Why cookieless: in `cookieless_mode: 'always'` PostHog writes nothing to the visitor's
 * device and derives identity server-side from a daily-salted hash. Nothing is stored on
 * terminal equipment, so ePrivacy Art. 5(3) (in Austria § 165 TKG 2021) is not engaged
 * and no consent is required. PostHog therefore runs outside the cookie banner in
 * main.js, which gates Google Analytics only, and measures 100% of traffic rather than
 * the share who accept the banner.
 *
 * The trade: identity does not survive the daily salt rotation, so a visitor returning
 * tomorrow counts as new. Sessions and page journeys within a visit still stitch, which
 * is what the marketing pages are actually being measured for.
 *
 * Same project and same EU host as the app (see react_Breezer/lib/posthogClient.js), so
 * web and product data sit in one place.
 */

// Vite inlines import.meta.env at build time, so an unset key makes the whole block
// below statically dead and the dynamic import is never emitted. That is deliberate:
// a static import would ship ~250 KB of PostHog to every visitor even when analytics
// is not configured.
const key = import.meta.env.PUBLIC_POSTHOG_KEY;
const host = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

/**
 * Resolves to the posthog instance, to null if it failed to load, or is null when
 * analytics is not configured at all.
 *
 * The catch matters: a rejected dynamic import (blocked by an extension, flaky network)
 * would otherwise surface as an unhandled rejection on every page load and again on
 * every tracked click. Analytics failing must never show up in a visitor's console.
 */
const client = key
  ? // The slim build, roughly half the size of the default one. It omits autocapture,
    // session replay and surveys, all of which are switched off below anyway.
    import('posthog-js/dist/module.slim')
      .then(({ default: posthog }) => {
        posthog.init(key, {
          api_host: host,
          // Not in this version's type declarations, but read by the runtime. Values
          // are 'always' | 'on_reject'.
          cookieless_mode: 'always',
          // Belt and braces: cookieless_mode already prevents persistence, but if that
          // option were ever dropped this keeps us out of the visitor's storage rather
          // than silently starting to set cookies.
          persistence: 'memory',
          // PostHog's documented companion to cookieless_mode: it turns any identify()
          // call into a no-op. Nothing on the marketing site identifies anyone, but a
          // persistent distinct ID is personal data and would undo the whole point, so
          // this makes that impossible rather than merely unlikely.
          person_profiles: 'never',
          // The site is hand-built and the one element that matters is instrumented
          // explicitly below. Autocapture would add generated selectors and no insight.
          autocapture: false,
          disable_session_recording: true,
          disable_surveys: true,
          // No flags or experiments on the marketing site, so skip the request entirely.
          advanced_disable_feature_flags: true,
          // Defaults to false. Turned on because the privacy policy offers DNT as the
          // Art. 21 objection route, and an objection route has to actually work.
          respect_dnt: true,
          // $pageview on load, $pageleave on unload. Astro serves real page loads rather
          // than client-side routes, so the defaults are correct without manual calls.
          capture_pageview: true,
          capture_pageleave: true,
        });
        return posthog;
      })
      .catch((err) => {
        if (import.meta.env.DEV) console.warn('[analytics] PostHog failed to load', err);
        return null;
      })
  : null;

export function track(event, props, options) {
  if (!client) {
    if (import.meta.env.DEV) console.log('[analytics] track', event, props ?? '');
    return;
  }
  client.then((posthog) => posthog?.capture(event, props, options));
}

/**
 * store_clicked is the only conversion this site has: the App Store is a hard break, so
 * nothing downstream of the click is knowable from here.
 *
 * Matched on href rather than a data attribute because the store buttons exist twice,
 * once in StoreButtons.astro and once inlined in the homepage hero. Matching the
 * destination catches both, and catches whatever gets added next without anyone having
 * to remember to tag it.
 */
const STORE_HOSTS = {
  'apps.apple.com': 'ios',
  'play.google.com': 'android',
};

function initStoreLinkTracking() {
  document.addEventListener(
    'click',
    (e) => {
      const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!link) return;

      let platform;
      try {
        platform = STORE_HOSTS[new URL(link.href, window.location.href).hostname];
      } catch {
        return;
      }
      if (!platform) return;

      track(
        'store_clicked',
        {
          platform,
          // Which marketing page earned the click. That is the whole question.
          page: window.location.pathname,
          lang: document.documentElement.lang.startsWith('de') ? 'de' : 'en',
        },
        // This click always navigates away. PostHog does flush queued events with
        // sendBeacon on pagehide, but asking for the beacon directly means the one
        // event we actually care about does not depend on that race.
        { transport: 'sendBeacon' }
      );
    },
    // Capture phase, so the handler runs even if something upstream stops propagation.
    true
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStoreLinkTracking);
} else {
  initStoreLinkTracking();
}
