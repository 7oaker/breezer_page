/**
 * Behaviour for the stats screen mockup (`src/components/home/StatsPhone.astro`).
 *
 * One job: switching Day / Week / Month / Year recomputes the whole screen the
 * way `react_Breezer/app/(tabs)/stats.jsx` does — bars, y scale, x labels, date
 * range, total, donut and caption — and re-grows every bar from zero, which is
 * what the app's chart does because it remounts on each switch.
 *
 * The markup already renders the Week state, so nothing here paints on load.
 */

/** Matches StatsPhone.astro's WEEK_LABELS: the app does not localise these. */
const WEEK_LABELS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

/** The app prints Year as bare month numbers, not month names. */
const YEAR_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

/**
 * The app thins crowded axes rather than letting labels collide: Day shows
 * every 6th hour, Month every 6th day. Week and Year show all of them.
 */
const LABEL_STRIDE = { day: 6, week: 1, month: 6, year: 1 };

/** The order the demo cycles through when nobody has touched it. */
const PERIODS = ['day', 'week', 'month', 'year'];

/**
 * How long each period holds before the demo moves on by itself. The bars take
 * 900ms to settle and the stagger adds up to another 250, so this still leaves
 * a beat of stillness on each period — but only just, which is the point: the
 * chart should look busy, not patient.
 */
const AUTO_CYCLE_MS = 3000;

/**
 * Bars grow one after another rather than all together. The app animates them
 * as one block, so this is a deliberate embellishment: a stagger is what makes
 * the switch read as the chart being redrawn rather than as a jump. The total
 * is capped so a 31-bar month does not take four times as long as a seven-bar
 * week.
 */
function staggerFor(count) {
  return Math.min(35, 250 / Math.max(1, count));
}

function el(root, name) {
  return root.querySelector(`[data-stats-${name}]`);
}

export function init() {
  const root = document.querySelector('[data-stats-phone]');
  if (!root) return;

  let config;
  try {
    config = JSON.parse(root.dataset.config || '{}');
  } catch {
    return;
  }
  if (!config.series) return;

  const lang = document.documentElement.lang || 'en';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nodes = {
    title: el(root, 'title'),
    range: el(root, 'range'),
    totalLabel: el(root, 'total-label'),
    total: el(root, 'total'),
    arc: el(root, 'arc'),
    percent: el(root, 'percent'),
    limitLabel: el(root, 'limit-label'),
    ticks: el(root, 'ticks'),
    limitLine: el(root, 'limit-line'),
    bars: el(root, 'bars'),
    labels: el(root, 'labels'),
    caption: el(root, 'caption'),
    brandLabel: el(root, 'brand-label'),
    strengthLabel: el(root, 'strength-label'),
  };

  /**
   * Every string the switch can produce, already resolved per period and per
   * locale by the component. The script therefore never holds a second copy of
   * anything translated, and never has to interpolate.
   */
  let strings;
  try {
    strings = JSON.parse(root.dataset.strings || '{}');
  } catch {
    return;
  }

  const monthShort = new Intl.DateTimeFormat(lang, { month: 'short' });

  /** The range text the summary card prints, in the page's own language. */
  function rangeText(period, now) {
    if (period === 'day') return `${now.getDate()} ${monthShort.format(now)}`;
    if (period === 'week') {
      const start = new Date(now);
      start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.getDate()} ${monthShort.format(start)} - ${end.getDate()} ${monthShort.format(end)}`;
    }
    if (period === 'month') {
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      return `1 ${monthShort.format(now)} - ${last} ${monthShort.format(now)}`;
    }
    // Short months and no year: "January - December 2026" wrapped onto two
    // lines in the summary card and pushed the total out of the box.
    return `${monthShort.format(new Date(now.getFullYear(), 0, 1))} - ${monthShort.format(new Date(now.getFullYear(), 11, 1))}`;
  }

  /** Days in the period, which is what the donut measures the total against. */
  function daysInPeriod(period, now) {
    if (period === 'day') return 1;
    if (period === 'week') return 7;
    if (period === 'month') return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return 365;
  }

  /** Takes the bar count so Month cannot label more days than it drew. */
  function xLabels(period, count) {
    if (period === 'week') return WEEK_LABELS;
    if (period === 'year') return YEAR_LABELS;
    return Array.from({ length: count }, (_, i) => String(period === 'day' ? i : i + 1));
  }

  function render(period, animate) {
    const now = new Date();
    // The month seed carries 31 entries; a 28-, 29- or 30-day month gets only
    // as many bars as it has days, which is what the x labels already claim.
    const values =
      period === 'month'
        ? config.series.month.slice(0, daysInPeriod('month', now))
        : config.series[period];
    const bar = config.bar[period];
    const plot = config.plotHeight;

    // The app's own scale rule: the tallest bar or the daily limit, whichever
    // is larger, over four sections with the tick labels truncated to integers.
    const limitForBars = period === 'year' ? config.dailyLimit * 30 : config.dailyLimit;
    const maxValue = Math.max(...values, limitForBars);
    const total = values.reduce((sum, v) => sum + v, 0);
    const limit = config.dailyLimit * daysInPeriod(period, now);
    const percentage = (total / limit) * 100;

    if (nodes.title) nodes.title.textContent = strings[`title_${period}`] || '';
    if (nodes.range) nodes.range.textContent = rangeText(period, now);
    if (nodes.totalLabel) nodes.totalLabel.textContent = strings[`total_${period}`] || '';
    if (nodes.total) nodes.total.textContent = String(total);
    if (nodes.brandLabel) nodes.brandLabel.textContent = strings[`brand_${period}`] || '';
    if (nodes.strengthLabel) nodes.strengthLabel.textContent = strings[`strength_${period}`] || '';
    if (nodes.caption) nodes.caption.textContent = strings[`caption_${period}`] || '';

    if (nodes.percent) nodes.percent.textContent = `${Math.round(percentage)}%`;
    if (nodes.limitLabel) {
      nodes.limitLabel.textContent =
        percentage > 100 ? strings.limit_exceeded : strings.within_limit;
    }
    if (nodes.arc) {
      // Over the limit the app wraps the arc rather than pinning it at full.
      const shown = percentage > 100 ? percentage % 100 : percentage;
      nodes.arc.setAttribute('stroke-dasharray', `${shown} 100`);
      nodes.arc.setAttribute('stroke', percentage > 100 ? '#c71606' : '#66cfff');
    }

    if (nodes.ticks) {
      nodes.ticks.innerHTML = '';
      for (let i = 0; i < 5; i += 1) {
        const span = document.createElement('span');
        span.textContent = String(Math.trunc(maxValue - (maxValue / 4) * i));
        nodes.ticks.appendChild(span);
      }
    }

    if (nodes.limitLine) {
      // Day and Year hide it: a per-day limit means nothing against 24 hourly
      // buckets or 12 monthly ones.
      const show = period === 'week' || period === 'month';
      nodes.limitLine.hidden = !show;
      if (show) {
        nodes.limitLine.style.top = `${(1 - config.dailyLimit / maxValue) * plot}px`;
      }
    }

    if (nodes.bars) {
      nodes.bars.style.gap = `${bar.gap}px`;
      nodes.bars.innerHTML = '';
      const heights = values.map((v) => Math.max(2, (v / maxValue) * plot));
      values.forEach((value, i) => {
        const span = document.createElement('span');
        span.className = 'stats-phone__bar block rounded-[4px]';
        span.style.width = `${bar.width}px`;
        span.style.background =
          value > limitForBars
            ? 'linear-gradient(135deg,#ff3b29,#c71606)'
            : 'linear-gradient(135deg,#1FD9FF,#0D6BCD)';
        // Start flat so the transition has somewhere to grow from, exactly as
        // the remounted chart does in the app.
        span.style.height = animate ? '0px' : `${heights[i]}px`;
        if (animate) span.style.transitionDelay = `${i * staggerFor(values.length)}ms`;
        nodes.bars.appendChild(span);
      });
      if (animate) {
        // One forced reflow, then the real heights: without it the browser
        // coalesces both writes and nothing animates.
        void nodes.bars.offsetHeight;
        [...nodes.bars.children].forEach((child, i) => {
          child.style.height = `${heights[i]}px`;
        });
      }
    }

    if (nodes.labels) {
      nodes.labels.style.gap = `${bar.gap}px`;
      nodes.labels.innerHTML = '';
      const stride = LABEL_STRIDE[period];
      xLabels(period, values.length).forEach((label, i) => {
        const span = document.createElement('span');
        span.className = 'text-center';
        span.style.width = `${bar.width}px`;
        span.textContent = i % stride === 0 ? label : '';
        nodes.labels.appendChild(span);
      });
    }
  }

  /** Moves the screen to a period and marks the matching button. */
  function select(period, animate) {
    root
      .querySelectorAll('[data-stats-period]')
      .forEach((other) => other.setAttribute('aria-pressed', String(other.dataset.statsPeriod === period)));
    render(period, animate);
  }

  let current = 'week'; // what the markup already renders
  let cycleTimer = null;
  // Once someone has picked a period, the demo stops picking for them.
  let taken = false;

  function stopCycle() {
    if (!cycleTimer) return;
    window.clearInterval(cycleTimer);
    cycleTimer = null;
  }

  function startCycle() {
    if (cycleTimer || taken || reduced) return;
    cycleTimer = window.setInterval(() => {
      current = PERIODS[(PERIODS.indexOf(current) + 1) % PERIODS.length];
      select(current, true);
    }, AUTO_CYCLE_MS);
  }

  root.querySelectorAll('[data-stats-period]').forEach((button) => {
    button.addEventListener('click', () => {
      taken = true;
      stopCycle();
      current = button.dataset.statsPeriod;
      select(current, !reduced);
    });
  });

  // Nothing cycles while the chart is off-screen or the tab is in the
  // background — the same bargain the other two screens make.
  let onScreen = true;

  function sync() {
    if (onScreen && !document.hidden) startCycle();
    else stopCycle();
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { threshold: 0.3 },
    );
    io.observe(root);
  }

  document.addEventListener('visibilitychange', sync);
  sync();
}
