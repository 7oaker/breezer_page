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

/**
 * Swaps the mouse pointer for a pointing hand while the cursor is over any of
 * the rebuilt screens, so operating a mockup feels like reaching for a phone
 * rather than mousing over a picture of one.
 *
 * One hand for all three devices: there is only ever one pointer, so the
 * element `AppHandCursor.astro` renders once gets bound to every screen on the
 * page rather than each screen carrying its own.
 *
 * Mouse only, and deliberately so. `hover: hover and pointer: fine` is the one
 * combination where a pointer exists to replace at all: on a phone the hand
 * would appear under the finger already covering the button, and with a stylus
 * or a TV remote it would trail whatever is really being aimed.
 *
 * Positions are viewport coordinates against `document.body`, which is why the
 * element gets moved there. `position: fixed` resolves against the nearest
 * transformed ancestor, and the hero device sits under two of those.
 */
function handCursor() {
  const hand = document.querySelector('[data-app-hand]');
  const screens = document.querySelectorAll('[data-app-screen]');
  if (!hand || !screens.length) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.body.appendChild(hand);
  hand.hidden = false;

  let x = 0;
  let y = 0;
  let frame = 0;

  function paint() {
    frame = 0;
    hand.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function follow(event) {
    x = event.clientX;
    y = event.clientY;
    // One write per frame. A mouse reports far more often than the screen
    // repaints, and every extra write is a layer the compositor redoes.
    if (!frame) frame = window.requestAnimationFrame(paint);
  }

  screens.forEach((screen) => {
    screen.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      // Placed before it is shown, or the fade-in would sweep it in from
      // wherever the last screen left it.
      paint();
      hand.setAttribute('data-visible', '');
      screen.setAttribute('data-hand-active', '');
    });

    screen.addEventListener('pointermove', follow);

    screen.addEventListener('pointerleave', () => {
      hand.removeAttribute('data-visible');
      hand.removeAttribute('data-press');
      screen.removeAttribute('data-hand-active');
    });

    // The squash is on pointerdown rather than click so it tracks the mouse
    // button itself: press and hold and the hand stays down, as a real one does.
    screen.addEventListener('pointerdown', () => hand.setAttribute('data-press', ''));
  });

  // On the window, because releasing after dragging off a device still has to
  // let the hand back up.
  window.addEventListener('pointerup', () => hand.removeAttribute('data-press'));
}

export function init() {
  fitScreens();
  handCursor();
  initPressPhone();
  initStatsPhone();
  initQuitPhone();
}
