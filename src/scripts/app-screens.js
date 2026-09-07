/**
 * Entry point for the rebuilt app screens on the homepage.
 *
 * Loaded only when an `[data-app-screen]` is on the page, which is the homepage
 * and nowhere else. Two jobs: fit every screen box to its frame, then hand off
 * to whichever screen behaviours are actually present.
 *
 * The markup already renders every value at its seeded state, so nothing here
 * paints anything on load — it only reacts and ticks.
 */
import { init as initPressPhone } from './press-phone.js';
import { init as initStatsPhone } from './stats-phone.js';
import { init as initQuitPhone } from './quit-phone.js';

/** The design width of the screen box; see AppScreen.astro's geometry contract. */
const DESIGN_WIDTH = 261;

/**
 * Each screen is laid out at 261px and scaled down when its device is narrower,
 * so every measurement inside it can stay a plain pixel value copied from the
 * app. The default in CSS is already correct at full size, so this only ever
 * has work to do below the cap.
 */
function fitScreens() {
  if (!('ResizeObserver' in window)) return;

  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const fit = entry.target;
      const screen = fit.querySelector('.app-screen__screen');
      const width = fit.clientWidth;
      if (!screen || !width) return;
      screen.style.setProperty('--app-screen-scale', String(width / DESIGN_WIDTH));
    });
  });

  document.querySelectorAll('.app-screen__fit').forEach((fit) => observer.observe(fit));
}

export function init() {
  fitScreens();
  initPressPhone();
  initStatsPhone();
  initQuitPhone();
}
