/**
 * Behaviour for the hero's live app mockup (`src/components/home/PressPhone.astro`).
 *
 * Loaded only when `[data-press-phone]` is on the page, which is the homepage
 * and nowhere else. The markup already renders every value at its seeded state,
 * so nothing here paints anything on load — it only reacts.
 *
 * The arithmetic mirrors `react_Breezer/components/homecards/TrackingView.jsx`:
 * a press is one pouch, so overall +1, cost + the unit price, usage time +30min,
 * and today +1 against the daily limit the donut draws.
 */
import { track } from './analytics.js';

/**
 * The unit price implied by the seeded 3632 pouches / 726.40 € in the source
 * screenshot. Hard-coding 0.25 (the app's own fallback of 6 € per 24) would
 * make the two numbers stop agreeing after the first press.
 */
const UNIT_PRICE = 0.2;
/** The app values a pouch at half an hour of use. */
const MINUTES_PER_POUCH = 30;

/** Names for the friend whose push arrives. Rotated so a repeat is not a replay. */
const FRIENDS = ['Marcus', 'Jonas', 'Elin'];

const FIRST_NOTIFICATION_MS = 6000;
const NOTIFICATION_EVERY_MS = 14000;
const NOTIFICATION_VISIBLE_MS = 5000;

/**
 * The app greys the button out and disables it for 15 minutes after a pouch, so
 * you cannot log the same one twice. Reproducing that literally would give a
 * visitor exactly one press and then a dead grey circle for the rest of the
 * visit, so the demo keeps the behaviour and shortens the clock: the state is
 * the app's, the duration is not.
 */
const PRESS_LOCK_MS = 9000;

/**
 * The app's `${d}d ${h}h ${m}min` with zero parts dropped, cut to the two most
 * significant units. The app itself keeps all three and lets the label ellipsis
 * take the overflow, but it has half again this much width to play with — at
 * 261px "14d 16h 30min" truncates to "14d 16h …" the moment anyone presses,
 * which reads as a bug rather than as a stat.
 */
function formatUsageTime(total) {
  const d = Math.floor(total / 1440);
  const h = Math.floor((total % 1440) / 60);
  const m = total % 60;
  const parts = [d && `${d}d`, h && `${h}h`, m && `${m}min`].filter(Boolean);
  return parts.slice(0, 2).join(' ') || '0min';
}

/**
 * "20 minutes" / "20 Minuten" / "20 minuter" without translating a single
 * duration string: Intl already knows all three, and the page's `lang` is the
 * only input it needs. The app humanises the same way through moment.
 */
function formatSince(seconds, lang) {
  // Under three quarters of a minute the app says "a few seconds", not a count.
  // `numeric: 'auto'` at zero is the same idea in every locale Intl knows —
  // "now", "jetzt", "nu" — and costs no translated string.
  if (seconds < 45) {
    try {
      return new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(0, 'second');
    } catch {
      /* falls through to the counted form below */
    }
  }

  const scale =
    seconds < 60
      ? ['second', Math.max(1, Math.round(seconds))]
      : seconds < 3600
        ? ['minute', Math.floor(seconds / 60)]
        : seconds < 86400
          ? ['hour', Math.floor(seconds / 3600)]
          : ['day', Math.floor(seconds / 86400)];

  try {
    return new Intl.NumberFormat(lang, {
      style: 'unit',
      unit: scale[0],
      unitDisplay: 'long',
    }).format(scale[1]);
  } catch {
    // `style: 'unit'` is ES2020; a browser without it still gets a number.
    return `${scale[1]}`;
  }
}

export function init() {
  const root = document.querySelector('[data-press-phone]');
  if (!root) return;

  let seed;
  try {
    seed = JSON.parse(root.dataset.seed || '{}');
  } catch {
    return;
  }

  const button = root.querySelector('[data-press-button]');
  const halo = root.querySelector('[data-press-halo]');
  const arrow = root.querySelector('[data-press-arrow]');
  const since = root.querySelector('[data-press-since]');
  const donut = root.querySelector('[data-press-donut]');
  const todayLabel = root.querySelector('[data-press-today-label]');
  const overallEl = root.querySelector('[data-press-overall]');
  const costEl = root.querySelector('[data-press-cost]');
  const usageTimeEl = root.querySelector('[data-press-usage-time]');
  const activityEl = root.querySelector('[data-press-activity]');
  const banner = root.querySelector('[data-press-banner]');
  const bannerName = root.querySelector('[data-press-banner-name]');

  if (!button) return;

  const lang = document.documentElement.lang || 'en';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state = {
    today: seed.today ?? 0,
    limit: seed.limit ?? 10,
    overall: seed.overall ?? 0,
    cost: seed.cost ?? 0,
    minutes: seed.minutes ?? 0,
    sinceSeconds: (seed.sinceLast ?? 0) * 60,
    activity: seed.activity ?? 0,
  };

  let pressed = false;
  let friendIndex = 0;
  let lockTimer = null;

  function renderSince() {
    if (since) since.textContent = formatSince(state.sinceSeconds, lang);
  }

  function renderStats() {
    const pct = Math.min(100, (state.today / state.limit) * 100);
    if (donut) donut.setAttribute('stroke-dasharray', `${pct} 100`);
    if (todayLabel) todayLabel.textContent = `${state.today}/${state.limit}`;
    if (overallEl) overallEl.textContent = String(state.overall);
    if (costEl) costEl.textContent = `${state.cost.toFixed(2)}€`;
    if (usageTimeEl) usageTimeEl.textContent = formatUsageTime(state.minutes);
  }

  /**
   * The app's cooldown: grey artwork, button disabled. `disabled` is what makes
   * this real rather than decorative — it takes the button out of the tab order
   * and stops a second click, so the guard against double-firing is the same
   * mechanism the app uses rather than a timestamp check bolted on beside it.
   */
  function lock() {
    button.setAttribute('data-locked', '');
    button.disabled = true;
    window.clearTimeout(lockTimer);
    lockTimer = window.setTimeout(() => {
      button.removeAttribute('data-locked');
      button.disabled = false;
    }, PRESS_LOCK_MS);
  }

  function onPress() {
    if (button.disabled) return;

    state.today += 1;
    state.overall += 1;
    state.cost += UNIT_PRICE;
    state.minutes += MINUTES_PER_POUCH;
    state.sinceSeconds = 0;

    renderStats();
    renderSince();

    lock();

    // The halo and the arrow are both invitations. Once one has been accepted
    // they are just noise.
    if (halo) halo.setAttribute('data-pressed', '');
    if (arrow) arrow.setAttribute('data-pressed', '');

    if (!pressed) {
      pressed = true;
      track('hero_press_demo');
    }
  }

  button.addEventListener('click', onPress);

  // The brand pills are cosmetic, but a row of pills that does not respond to a
  // click reads as broken rather than as decoration.
  root.querySelectorAll('[data-press-brand]').forEach((pill) => {
    pill.addEventListener('click', () => {
      root
        .querySelectorAll('[data-press-brand]')
        .forEach((other) => other.setAttribute('aria-pressed', String(other === pill)));
    });
  });

  // Counter ticks on the app's own 10s cadence.
  let tickTimer = null;
  function startTicking() {
    if (tickTimer) return;
    tickTimer = window.setInterval(() => {
      state.sinceSeconds += 10;
      renderSince();
    }, 10000);
  }
  function stopTicking() {
    if (!tickTimer) return;
    window.clearInterval(tickTimer);
    tickTimer = null;
  }

  // The friend's push. It fires on its own schedule rather than off a press, so
  // the social hook lands for a visitor who never touches the button.
  let bannerTimer = null;
  let hideTimer = null;

  function showBanner() {
    if (!banner) return;
    if (bannerName) bannerName.textContent = FRIENDS[friendIndex % FRIENDS.length];
    friendIndex += 1;
    banner.setAttribute('data-visible', '');

    // A friend's pouch is exactly what the Social card's activity count counts.
    state.activity += 1;
    if (activityEl) activityEl.textContent = String(state.activity);

    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(
      () => banner.removeAttribute('data-visible'),
      reduced ? 8000 : NOTIFICATION_VISIBLE_MS,
    );
  }

  function startBanner() {
    if (bannerTimer || !banner) return;
    bannerTimer = window.setTimeout(() => {
      showBanner();
      // Reduced motion gets the notification once and then a still page, the
      // same bargain the rest of the site's ambient animation makes.
      if (reduced) return;
      bannerTimer = window.setInterval(showBanner, NOTIFICATION_EVERY_MS);
    }, FIRST_NOTIFICATION_MS);
  }
  function stopBanner() {
    if (!bannerTimer) return;
    window.clearTimeout(bannerTimer);
    window.clearInterval(bannerTimer);
    bannerTimer = null;
  }

  // Nothing runs while the phone is off-screen or the tab is in the background.
  let onScreen = true;

  function sync() {
    if (onScreen && !document.hidden) {
      startTicking();
      startBanner();
    } else {
      stopTicking();
      stopBanner();
    }
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { threshold: 0.2 },
    );
    io.observe(root);
  }

  document.addEventListener('visibilitychange', sync);
  sync();
}
