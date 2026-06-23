import '../../node_modules/glightbox/dist/css/glightbox.min.css';
import 'swiper/css';
import 'swiper/css/pagination';
import '../css/animate.css';
import '../css/style.css';
import ogImage from '../images/logo/og-image.png'; // Import the Open Graph image
import robotsTxt from '../robots.txt'; // Import robots.txt
import sitemapXml from '../sitemap.xml'; // Import sitemap.xmlimport GLightbox from 'glightbox';
import Swiper, { Navigation } from 'swiper';
import WOW from 'wowjs';

/**
 * Cookie consent (DSGVO/GDPR-style opt-in) for Google Analytics.
 * - No analytics script is loaded until user explicitly enables Analytics.
 * - Consent is stored in a first-party cookie (essential cookie).
 * - A "Cookie settings" footer link (data-cookie-settings) re-opens settings.
 */
const BREEZER_GA_MEASUREMENT_ID = 'G-F1DFG9VDZQ';
const BREEZER_COOKIE_CONSENT_KEY = 'breezer_cookie_consent_v1';

function breezerIsGermanPage() {
  const lang = (document.documentElement.lang || '').toLowerCase();
  if (lang.startsWith('de')) return true;
  const path = window.location.pathname.replace(/\/index\.html$/i, '/');
  return path === '/de/' || path.startsWith('/de/');
}

function breezerPrivacyPolicyUrl() {
  return breezerIsGermanPage() ? '../privacy-policy-website.html' : 'privacy-policy-website.html';
}

const BREEZER_UI = {
  en: {
    cookiesTitle: 'Cookies & privacy',
    cookiesIntro:
      'We use <strong>essential storage</strong> for basic functionality (theme, language preference when you choose it) and, with your permission, <strong>Google Analytics</strong> to measure website usage and improve the site.',
    cookiesHint:
      'You can change your choice anytime via <strong>Cookie settings</strong> in the footer.',
    learnMore: 'Learn more',
    acceptAnalytics: 'Accept analytics',
    reject: 'Reject',
    customize: 'Customize',
    essential: 'Essential',
    essentialHint:
      'Required for basic functionality and preferences (theme, language when selected).',
    alwaysOn: 'Always on',
    analytics: 'Analytics',
    analyticsHint: 'Google Analytics to understand usage and improve the website.',
    enable: 'Enable',
    saveSelection: 'Save selection',
    cookieSettings: 'Cookie settings',
    cookieSettingsIntro:
      'Choose whether we may use Google Analytics. Essential storage (theme, language when you select it) is always enabled.',
    close: 'Close',
    rejectAnalytics: 'Reject analytics',
    save: 'Save',
    formSuccess: 'Thank you for reaching out! We will get back to you soon.',
    formError: 'Something went wrong. Please try again later.',
  },
  de: {
    cookiesTitle: 'Cookies & Datenschutz',
    cookiesIntro:
      'Wir nutzen <strong>essenzielle Speicherung</strong> für Grundfunktionen (Theme, Sprache wenn du sie wählst) und mit deiner Zustimmung <strong>Google Analytics</strong>, um die Website-Nutzung zu messen und die Seite zu verbessern.',
    cookiesHint:
      'Du kannst deine Wahl jederzeit über <strong>Cookie-Einstellungen</strong> im Footer ändern.',
    learnMore: 'Mehr erfahren',
    acceptAnalytics: 'Analytics akzeptieren',
    reject: 'Ablehnen',
    customize: 'Anpassen',
    essential: 'Essenziell',
    essentialHint:
      'Erforderlich für Grundfunktionen und Einstellungen (Theme, Sprache bei Auswahl).',
    alwaysOn: 'Immer aktiv',
    analytics: 'Analytics',
    analyticsHint:
      'Google Analytics, um die Nutzung zu verstehen und die Website zu verbessern.',
    enable: 'Aktivieren',
    saveSelection: 'Auswahl speichern',
    cookieSettings: 'Cookie-Einstellungen',
    cookieSettingsIntro:
      'Wähle, ob wir Google Analytics nutzen dürfen. Essenzielle Speicherung (Theme, Sprache bei Auswahl) ist immer aktiv.',
    close: 'Schließen',
    rejectAnalytics: 'Analytics ablehnen',
    save: 'Speichern',
    formSuccess: 'Danke für deine Nachricht! Wir melden uns bald bei dir.',
    formError: 'Etwas ist schiefgelaufen. Bitte versuche es später erneut.',
  },
};

function breezerUi(key) {
  const locale = breezerIsGermanPage() ? 'de' : 'en';
  return BREEZER_UI[locale][key];
}
const BREEZER_COOKIE_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 12 months

function breezerParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function breezerGetCookie(name) {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const c of cookies) {
    const idx = c.indexOf('=');
    if (idx === -1) continue;
    const k = decodeURIComponent(c.slice(0, idx));
    if (k !== name) continue;
    return decodeURIComponent(c.slice(idx + 1));
  }
  return null;
}

function breezerSetCookie(name, value, maxAgeSeconds) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
}

function breezerGetConsent() {
  // Migration (one-time): if old localStorage consent exists, move it to cookie.
  const legacyRaw = localStorage.getItem(BREEZER_COOKIE_CONSENT_KEY);
  if (legacyRaw && !breezerGetCookie(BREEZER_COOKIE_CONSENT_KEY)) {
    const legacyParsed = breezerParseJson(legacyRaw);
    if (legacyParsed && typeof legacyParsed === 'object') {
      const migrated = {
        analytics: Boolean(legacyParsed.analytics),
        updatedAt: legacyParsed.updatedAt || null,
        version: legacyParsed.version || 1,
      };
      breezerSetCookie(
        BREEZER_COOKIE_CONSENT_KEY,
        JSON.stringify(migrated),
        BREEZER_COOKIE_CONSENT_MAX_AGE_SECONDS
      );
    }
    localStorage.removeItem(BREEZER_COOKIE_CONSENT_KEY);
  }

  const raw = breezerGetCookie(BREEZER_COOKIE_CONSENT_KEY);
  const parsed = raw ? breezerParseJson(raw) : null;
  if (!parsed || typeof parsed !== 'object') return null;
  return {
    analytics: Boolean(parsed.analytics),
    updatedAt: parsed.updatedAt || null,
    version: parsed.version || 1,
  };
}

function breezerSetConsent(next) {
  const payload = {
    analytics: Boolean(next.analytics),
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  breezerSetCookie(
    BREEZER_COOKIE_CONSENT_KEY,
    JSON.stringify(payload),
    BREEZER_COOKIE_CONSENT_MAX_AGE_SECONDS
  );
  return payload;
}

function breezerDeleteCookie(name) {
  // Expire cookie for current path and root path; best-effort only.
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax; domain=${location.hostname}`;
}

function breezerDisableGoogleAnalytics() {
  window[`ga-disable-${BREEZER_GA_MEASUREMENT_ID}`] = true;
  breezerDeleteCookie('_ga');
  // GA4 property cookies are usually _ga_<container-id>
  document.cookie
    .split(';')
    .map((c) => c.trim().split('=')[0])
    .filter((n) => n.startsWith('_ga_'))
    .forEach((n) => breezerDeleteCookie(n));
}

function breezerEnsureGtagStub() {
  if (window.dataLayer && typeof window.gtag === 'function') return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  // Default: deny everything until explicit opt-in.
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500,
  });
}

function breezerLoadGoogleAnalytics() {
  if (window[`ga-disable-${BREEZER_GA_MEASUREMENT_ID}`]) return;
  if (document.getElementById('breezer-ga-gtag')) return;

  breezerEnsureGtagStub();
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  const script = document.createElement('script');
  script.async = true;
  script.id = 'breezer-ga-gtag';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(BREEZER_GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', BREEZER_GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    send_page_view: true,
  });
}

function breezerApplyConsent(consent) {
  if (!consent || !consent.analytics) {
    breezerDisableGoogleAnalytics();
    return;
  }
  // Re-enable GA if previously disabled in this session.
  window[`ga-disable-${BREEZER_GA_MEASUREMENT_ID}`] = false;
  breezerLoadGoogleAnalytics();
}

function breezerCreateCookieBanner() {
  const wrapper = document.createElement('div');
  wrapper.id = 'breezer-cookie-banner';
  wrapper.className = 'fixed inset-x-0 bottom-0 z-[9999] p-4 sm:p-6';

  wrapper.innerHTML = `
    <div class="mx-auto max-w-4xl rounded-xl border border-stroke bg-white/95 shadow-card backdrop-blur dark:border-stroke-dark dark:bg-[#15182B]/95 dark:shadow-card-dark">
      <div class="p-4 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="max-w-2xl">
            <h2 class="text-base font-semibold text-black dark:text-white">${breezerUi('cookiesTitle')}</h2>
            <p class="mt-2 text-sm text-body dark:text-white/70">
              ${breezerUi('cookiesIntro')}
            </p>
            <p class="mt-2 text-xs text-body dark:text-white/60">
              ${breezerUi('cookiesHint')}
            </p>
            <a href="${breezerPrivacyPolicyUrl()}" class="mt-2 inline-block text-sm text-primary underline underline-offset-2">${breezerUi('learnMore')}</a>
          </div>

          <div class="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[220px]">
            <button type="button" data-cc-accept class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90">
              ${breezerUi('acceptAnalytics')}
            </button>
            <button type="button" data-cc-reject class="rounded-md border border-stroke bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray dark:border-stroke-dark dark:bg-black dark:text-white">
              ${breezerUi('reject')}
            </button>
            <button type="button" data-cc-customize class="rounded-md px-4 py-2 text-sm font-medium text-primary hover:underline">
              ${breezerUi('customize')}
            </button>
          </div>
        </div>

        <div data-cc-panel class="mt-5 hidden border-t border-stroke pt-5 dark:border-stroke-dark">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-black dark:text-white">${breezerUi('essential')}</p>
              <p class="mt-1 text-xs text-body dark:text-white/60">${breezerUi('essentialHint')}</p>
            </div>
            <span class="text-xs font-semibold text-body dark:text-white/60">${breezerUi('alwaysOn')}</span>
          </div>

          <div class="mt-4 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-black dark:text-white">${breezerUi('analytics')}</p>
              <p class="mt-1 text-xs text-body dark:text-white/60">${breezerUi('analyticsHint')}</p>
            </div>
            <label class="flex items-center gap-2">
              <input data-cc-analytics type="checkbox" class="h-4 w-4 accent-primary" />
              <span class="text-sm text-body dark:text-white/70">${breezerUi('enable')}</span>
            </label>
          </div>

          <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button type="button" data-cc-save class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90">
              ${breezerUi('saveSelection')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const panel = wrapper.querySelector('[data-cc-panel]');
  const analyticsToggle = wrapper.querySelector('[data-cc-analytics]');

  const openCustomize = () => {
    panel.classList.remove('hidden');
    const existing = breezerGetConsent();
    analyticsToggle.checked = Boolean(existing?.analytics);
  };

  wrapper.querySelector('[data-cc-customize]').addEventListener('click', openCustomize);
  wrapper.querySelector('[data-cc-accept]').addEventListener('click', () => {
    const consent = breezerSetConsent({ analytics: true });
    breezerApplyConsent(consent);
    wrapper.remove();
  });
  wrapper.querySelector('[data-cc-reject]').addEventListener('click', () => {
    const consent = breezerSetConsent({ analytics: false });
    breezerApplyConsent(consent);
    wrapper.remove();
  });
  wrapper.querySelector('[data-cc-save]').addEventListener('click', () => {
    const consent = breezerSetConsent({ analytics: analyticsToggle.checked });
    breezerApplyConsent(consent);
    wrapper.remove();
  });

  return wrapper;
}

function breezerOpenCookieSettingsModal() {
  const existing = breezerGetConsent() || { analytics: false };

  const overlay = document.createElement('div');
  overlay.id = 'breezer-cookie-settings';
  overlay.className = 'fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:items-center';
  overlay.innerHTML = `
    <div class="absolute inset-0 bg-black/50"></div>
    <div class="relative w-full max-w-xl rounded-xl border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-[#15182B] dark:shadow-card-dark">
      <div class="p-5 sm:p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-base font-semibold text-black dark:text-white">${breezerUi('cookieSettings')}</h2>
            <p class="mt-2 text-sm text-body dark:text-white/70">
              ${breezerUi('cookieSettingsIntro')}
            </p>
          </div>
          <button type="button" data-cc-close class="rounded-md px-2 py-1 text-sm text-body hover:text-black dark:text-white/70 dark:hover:text-white" aria-label="${breezerUi('close')}">
            ${breezerUi('close')}
          </button>
        </div>

        <div class="mt-5 space-y-4 border-t border-stroke pt-5 dark:border-stroke-dark">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-black dark:text-white">${breezerUi('essential')}</p>
              <p class="mt-1 text-xs text-body dark:text-white/60">${breezerUi('essentialHint')}</p>
            </div>
            <span class="text-xs font-semibold text-body dark:text-white/60">${breezerUi('alwaysOn')}</span>
          </div>

          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-black dark:text-white">${breezerUi('analytics')}</p>
              <p class="mt-1 text-xs text-body dark:text-white/60">${breezerUi('analyticsHint')}</p>
            </div>
            <label class="flex items-center gap-2">
              <input data-cc-analytics type="checkbox" class="h-4 w-4 accent-primary" />
              <span class="text-sm text-body dark:text-white/70">${breezerUi('enable')}</span>
            </label>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" data-cc-reject class="rounded-md border border-stroke bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray dark:border-stroke-dark dark:bg-black dark:text-white">
            ${breezerUi('rejectAnalytics')}
          </button>
          <button type="button" data-cc-save class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90">
            ${breezerUi('save')}
          </button>
        </div>
      </div>
    </div>
  `;

  const checkbox = overlay.querySelector('[data-cc-analytics]');
  checkbox.checked = Boolean(existing.analytics);

  const close = () => overlay.remove();

  overlay.querySelector('[data-cc-close]').addEventListener('click', close);
  overlay.querySelector('[data-cc-reject]').addEventListener('click', () => {
    const consent = breezerSetConsent({ analytics: false });
    breezerApplyConsent(consent);
    close();
  });
  overlay.querySelector('[data-cc-save]').addEventListener('click', () => {
    const consent = breezerSetConsent({ analytics: checkbox.checked });
    breezerApplyConsent(consent);
    close();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay.querySelector('.absolute')) close();
  });

  document.body.appendChild(overlay);
}

function breezerInitCookieConsent() {
  // Ensure a safe default in case any Google tag code is added later.
  breezerEnsureGtagStub();

  const existing = breezerGetConsent();
  if (existing) {
    breezerApplyConsent(existing);
  } else {
    document.body.appendChild(breezerCreateCookieBanner());
  }

  // Footer link handler(s)
  document.querySelectorAll('[data-cookie-settings]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      breezerOpenCookieSettingsModal();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', breezerInitCookieConsent);
} else {
  breezerInitCookieConsent();
}

window.wow = new WOW.WOW({
  live: false,
});

window.wow.init({
  offset: 50,
});

// Testimonial
const testimonial = new Swiper('.mySwiper', {
  // configure Swiper to use modules
  modules: [Navigation],
  slidesPerView: 1,
  spaceBetween: 30,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  loop: true,
  breakpoints: {
    // when window width is >= 640px
    768: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
  },
});

//========= glightbox 
//GLightbox({
 // href: "https://www.youtube.com/watch?v=r44RKWyfcFw&fbclid=IwAR21beSJORalzmzokxDRcGfkZA1AtRTE__l5N4r09HcGS5Y6vOluyouM9EM",
 // type: "video",
 // source: "youtube", //vimeo, youtube or local
  //width: 900,
  //autoplayVideos: true,
//});

(function () {
  'use strict';

  /* ========  mobile menu  start ========= */
  const menuWrapper = document.querySelector('.menu-wrapper');
  const body = document.querySelector('body');
  document.querySelector('.navbarOpen').addEventListener('click', () => {
    menuWrapper.classList.remove('hidden');
    body.classList.add('overflow-hidden');
  });
  document.querySelector('.navbarClose').addEventListener('click', () => {
    menuWrapper.classList.add('hidden');
    body.classList.remove('overflow-hidden');
  });

  // === close navbar-collapse when a  clicked
  document.querySelectorAll('.navbar li:not(.submenu-item) a').forEach((e) =>
    e.addEventListener('click', () => {
      menuWrapper.classList.add('hidden');
      body.classList.remove('overflow-hidden');
    })
  );

  // === Sub-menu
  const submenuItems = document.querySelectorAll('.submenu-item');
  submenuItems.forEach((el) => {
    el.querySelector('a').addEventListener('click', () => {
      el.querySelector('a').classList.toggle('active');
      el.querySelector('.submenu').classList.toggle('hidden');
    });
  });

  /* ========  mobile menu end ========= */

  window.onscroll = function () {
    // ===  Sticky Navbar
    const header = document.querySelector('.navbar');
    if (window.pageYOffset >= 100) {
      header.classList.add('sticky-navbar');
    } else {
      header.classList.remove('sticky-navbar');
    }

    // ===  show or hide the back-top-top button
    const backToTop = document.querySelector('.back-to-top');
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  };

  /* ========  themeSwitcher start ========= */

// Theme Vars
const themeSwitcher = document.getElementById('themeSwitcher'); // Button to toggle theme
const userTheme = localStorage.getItem('theme'); // Get the saved theme from localStorage
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches; // Check system theme

// Initial Theme Check
const themeCheck = () => {
  if (userTheme === 'dark' || (!userTheme && systemTheme)) {
    document.documentElement.classList.add('dark'); // Apply dark mode
  } else {
    document.documentElement.classList.remove('dark'); // Apply light mode
  }
};

// Manual Theme Switch
const themeSwitch = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark'); // Switch to light mode
    localStorage.setItem('theme', 'light'); // Save preference in localStorage
  } else {
    document.documentElement.classList.add('dark'); // Switch to dark mode
    localStorage.setItem('theme', 'dark'); // Save preference in localStorage
  }
};

// Add Event Listener to Theme Switcher Button
if (themeSwitcher) {
  themeSwitcher.addEventListener('click', () => {
    themeSwitch();
  });
}

// Invoke Theme Check on Initial Load
themeCheck();
  /* ========  themeSwitcher End ========= */

  /* ========  scroll to top  start ========= */
  function scrollTo(element, to = 0, duration = 500) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;

      const val = Math.easeInOutQuad(currentTime, start, change, duration);

      element.scrollTop = val;

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }

  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  document.querySelector('.back-to-top').onclick = () => {
    scrollTo(document.documentElement);
  };
  /* ========  scroll to top  end ========= */
})();

// Document Loaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent form submission
      const webhookUrl = process.env.REACT_APP_WEBHOOK_URL;
      const formData = new FormData(this);
      const data = {
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
      };
      console.log("weburl", webhookUrl);
      console.log("data", data); // Log the data being sent

      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Sending JSON data
        },
        body: JSON.stringify(data), // Stringify the data to JSON
      })
      .then(response => {
        if (response.ok) { // Check if response status is OK (2xx)
          return response.text(); // If OK, return the response as text
        } else {
          throw new Error('Something went wrong'); // Throw an error if response is not OK
        }
      })
      .then(responseText => {
        console.log('Response from webhook:', responseText); // Log the raw response (e.g., "Accepted")
        alert(breezerUi('formSuccess'));
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(breezerUi('formError'));
      });
    });
  } else {
    console.log('Form element not found in the DOM.');
  }

  document.querySelectorAll('[data-set-lang]').forEach(function (link) {
    link.addEventListener('click', function () {
      var lang = link.getAttribute('data-set-lang');
      if (lang === 'en' || lang === 'de') {
        try {
          localStorage.setItem('breezer_lang', lang);
        } catch (e) {
          // Ignore if storage is unavailable.
        }
      }
    });
  });
});