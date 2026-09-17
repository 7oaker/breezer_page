/**
 * Behaviour for the quit screen mockup (`src/components/home/QuitPhone.astro`).
 *
 * One `setInterval(…, 1000)` recomputing every number from the elapsed
 * duration, which is exactly what `react_Breezer/components/homecards/QuittingView.jsx`
 * does. Nothing is operable; the screen just runs.
 *
 * The start is anchored relative to page load rather than baked into the HTML,
 * so the sample account is always the same age however long it has been since
 * the site was last built.
 */

/** The app values a pouch at half an hour of life back. */
const MINUTES_PER_SNUS = 30;

/**
 * The milestone push. It arrives once, because a milestone does: the press
 * screen loops its friend's notification on purpose, since that loop is the
 * social claim it is making, and repeating a "day 24 reached" would read as a
 * bug rather than as a second friend.
 *
 * The delay is short because the arming below waits for the banner itself to be
 * on screen: it only has to be long enough for the push to read as arriving
 * rather than as part of the mockup, not long enough to cover a scroll.
 */
const NOTIFICATION_AFTER_MS = 700;
const NOTIFICATION_VISIBLE_MS = 6000;

/** `computeQuittingSavings` — mirrors QuitPhone.astro's server-side copy. */
function savingsFor(elapsedSeconds, habit) {
  const days = elapsedSeconds / 86400;
  const expected = Math.max(0, days * habit.dailyLimit);
  const costPerSnus = habit.pricePerPack / habit.snusPerPack;
  return {
    avoided: Math.floor(expected),
    saved: expected * costPerSnus,
    minutesGained: Math.round(expected * MINUTES_PER_SNUS),
  };
}

/** The app: `Nd Nh` once a day has accrued, else `Nh Nm`. */
function formatGained(minutes) {
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return days > 0 ? `${days}d ${hours % 24}h` : `${hours}h ${minutes % 60}m`;
}

/**
 * Calendar decomposition, so the chips read `0y 4m 21d` against a floored
 * `143 Days` on the same card — the app's two views of one span.
 */
function decompose(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();
  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  return { years, months, days, hours, minutes, seconds };
}

export function init() {
  const root = document.querySelector('[data-quit-phone]');
  if (!root) return;

  let config;
  try {
    config = JSON.parse(root.dataset.config || '{}');
  } catch {
    return;
  }
  if (!config.quitSeconds || !config.habit) return;

  // A number changing once a second is exactly what this preference asks to be
  // spared, and the site's convention is a completely still page. The markup is
  // already rendered at its seeded values, so opting out simply leaves the clock
  // there. The push still arrives: it lands once and then holds still, which is
  // the same bargain the press screen's banner makes under this preference.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const start = new Date(Date.now() - config.quitSeconds * 1000);
  const chips = {};
  root.querySelectorAll('[data-quit-chip]').forEach((node) => {
    chips[node.dataset.quitChip] = node;
  });
  const totalDaysNode = root.querySelector('[data-quit-total-days]');
  const avoidedNode = root.querySelector('[data-quit-avoided]');
  const savedNode = root.querySelector('[data-quit-saved]');
  const gainedNode = root.querySelector('[data-quit-gained]');

  function update() {
    const now = new Date();
    const elapsedSeconds = Math.floor((now - start) / 1000);
    const parts = decompose(start, now);
    const savings = savingsFor(elapsedSeconds, config.habit);

    Object.keys(chips).forEach((key) => {
      const next = String(parts[key]);
      if (chips[key].textContent !== next) chips[key].textContent = next;
    });

    const totalDays = String(Math.floor(elapsedSeconds / 86400));
    if (totalDaysNode && totalDaysNode.textContent !== totalDays) {
      totalDaysNode.textContent = totalDays;
    }
    if (avoidedNode) avoidedNode.textContent = String(savings.avoided);
    if (savedNode) savedNode.textContent = `${savings.saved.toFixed(1)} €`;
    if (gainedNode) gainedNode.textContent = formatGained(savings.minutesGained);
  }

  // The push. Armed off the banner's own visibility rather than the phone's, so
  // a visitor who scrolls straight past does not spend their one notification on
  // an empty viewport, and the delay above can be short enough to still be there
  // when they arrive. The banner sits at the top of a 594px device: the phone
  // being a fifth on screen says nothing about whether the strip the push lands
  // on is.
  const banner = root.querySelector('[data-quit-banner]');
  let bannerTimer = null;
  let bannerFired = false;
  // Starts closed where an observer will answer within a frame, and open where
  // there is none to answer at all, since without one the push would otherwise
  // never arrive.
  let bannerOnScreen = !('IntersectionObserver' in window);

  function startBanner() {
    if (!banner || bannerFired || bannerTimer) return;
    bannerTimer = window.setTimeout(() => {
      bannerFired = true;
      banner.setAttribute('data-visible', '');
      // No handle kept: it fires once, so there is never a second one to cancel.
      window.setTimeout(() => banner.removeAttribute('data-visible'), NOTIFICATION_VISIBLE_MS);
    }, NOTIFICATION_AFTER_MS);
  }

  function stopBanner() {
    if (!bannerTimer) return;
    window.clearTimeout(bannerTimer);
    bannerTimer = null;
  }

  // Nothing ticks while the phone is off-screen or the tab is in the background.
  let timer = null;
  let onScreen = true;

  function sync() {
    if (bannerOnScreen && !document.hidden) startBanner();
    else stopBanner();

    if (onScreen && !document.hidden) {
      if (!timer && !reduced) {
        update();
        timer = window.setInterval(update, 1000);
      }
    } else if (timer) {
      window.clearInterval(timer);
      timer = null;
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

    if (banner) {
      // A ratio would be meaningless here: the hidden banner sits on
      // `translateY(-120%)`, which puts most of its box above the screen
      // window's `overflow: hidden`, so it is clipped to roughly a quarter of
      // itself and never reads as more. So: any of it intersecting, against a
      // viewport shortened by 90px at the bottom, which is the distance from the
      // top of the screen window to the bottom edge of the banner where it lands.
      // Intersecting then means the resting banner is fully in view.
      const bannerIo = new IntersectionObserver(
        (entries) => {
          bannerOnScreen = entries.some((entry) => entry.isIntersecting);
          sync();
        },
        { rootMargin: '0px 0px -90px 0px', threshold: 0 },
      );
      bannerIo.observe(banner);
    }
  }

  document.addEventListener('visibilitychange', sync);
  sync();
}
