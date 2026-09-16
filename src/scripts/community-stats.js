/**
 * Keeps the community numbers band moving between builds.
 *
 * The Appwrite row is written once a week, but three of its figures are linear in time:
 * days without snus grows by one per quitter per day, money and pouches by the rates
 * stored next to them. Each tile carries its own `data-base` and `data-rate`, so this
 * only ever does base + rate * days-since-computedAt. No request, no state of its own.
 *
 * The markup already holds the value projected to build time, so nothing here paints on
 * load and a visitor without JavaScript still sees a correct number, just an older one.
 *
 * The count-up is decoration: it is skipped under prefers-reduced-motion, and the ticking
 * interval is started up front rather than by the animation's callback, because
 * requestAnimationFrame does not run in a background tab. Hanging the real behaviour off
 * a frame that may never arrive would mean a page opened in a background tab and read an
 * hour later still showed the build time value.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const TICK_MS = 1000;
const COUNT_UP_MS = 1200;
const COUNT_UP_GIVE_UP_MS = 4000;

function formatterFor(locale, kind) {
  if (kind === 'money') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });
  }
  return new Intl.NumberFormat(locale);
}

function readTiles(root, locale) {
  return Array.from(root.querySelectorAll('[data-stat-value]')).map((el) => ({
    el,
    base: Number(el.dataset.base) || 0,
    rate: Number(el.dataset.rate) || 0,
    format: formatterFor(locale, el.dataset.kind),
  }));
}

/** What a tile should read right now. Never counts backwards on a slow clock. */
function currentValue(tile, computedAt, now) {
  const days = Math.max(0, (now - computedAt) / DAY_MS);
  return Math.round(tile.base + tile.rate * days);
}

function paint(tiles, computedAt, now, progress = 1) {
  for (const tile of tiles) {
    const value = currentValue(tile, computedAt, now);
    tile.el.textContent = tile.format.format(Math.round(value * progress));
  }
}

export function init() {
  const root = document.querySelector('[data-community-stats]');
  if (!root) return;

  const computedAt = new Date(root.dataset.computedAt || '').getTime();
  if (!Number.isFinite(computedAt)) return;

  const tiles = readTiles(root, root.dataset.locale || 'en');
  if (tiles.length === 0) return;

  let animating = false;
  setInterval(() => {
    if (animating) return;
    paint(tiles, computedAt, Date.now());
  }, TICK_MS);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const countUp = () => {
    animating = true;
    const started = performance.now();
    // Whatever happens to the frames, the numbers end up correct.
    const giveUp = setTimeout(() => {
      animating = false;
      paint(tiles, computedAt, Date.now());
    }, COUNT_UP_GIVE_UP_MS);

    // performance.now() rather than the frame timestamp the callback is handed: after a
    // tab has been in the background the first frame can carry a timestamp from before
    // this animation started, and a negative elapsed makes the eased progress negative,
    // which paints every figure as a minus number until the next repaint.
    const step = () => {
      const elapsed = performance.now() - started;
      if (elapsed >= COUNT_UP_MS) {
        clearTimeout(giveUp);
        animating = false;
        paint(tiles, computedAt, Date.now());
        return;
      }
      // Ease out: the numbers arrive fast and settle rather than stopping dead. Clamped
      // as well as measured safely, because a figure that renders wrong once is worse
      // than one that does not animate.
      const ratio = Math.min(1, Math.max(0, elapsed / COUNT_UP_MS));
      const progress = 1 - Math.pow(1 - ratio, 3);
      paint(tiles, computedAt, Date.now(), progress);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (typeof IntersectionObserver !== 'function') {
    countUp();
    return;
  }

  // Counting up in a band nobody has scrolled to yet is an animation that has already
  // finished by the time it is looked at.
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.disconnect();
      countUp();
    }
  }, { threshold: 0.25 });
  observer.observe(root);
}
