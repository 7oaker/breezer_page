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
  // already rendered at its seeded values, so opting out simply leaves it there.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

  // Nothing ticks while the phone is off-screen or the tab is in the background.
  let timer = null;
  let onScreen = true;

  function sync() {
    const shouldRun = onScreen && !document.hidden;
    if (shouldRun && !timer) {
      update();
      timer = window.setInterval(update, 1000);
    } else if (!shouldRun && timer) {
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
  }

  document.addEventListener('visibilitychange', sync);
  sync();
}
