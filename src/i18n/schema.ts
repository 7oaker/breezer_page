/**
 * Shared schema.org nodes. Entity-rich, consistent @ids across every page —
 * this is what generative engines resolve a brand against, so the Organization
 * and MobileApplication nodes must not drift between pages or locales.
 */

import { locales, localeCodes } from './locales';

const SITE = 'https://breezer.now';

/**
 * Derived from the locale registry so the entity nodes cannot claim a language
 * the site does not ship, and cannot forget one it does. Generative engines
 * resolve a brand across pages by these @ids, so a node that disagrees with
 * itself between locales is worse than a node with less detail.
 */
const SITE_LANGUAGES = localeCodes.map((code) => locales[code].htmlLang);

export const organization = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Breezer',
  url: SITE,
  logo: `${SITE}/images/logo.webp`,
  email: 'info@breezer.now',
  // Entity resolution: what an answer engine reads when it has to decide what
  // "Breezer" refers to. Without it the brand competes with a drinks brand of
  // the same name, which is measurably what happens in the Indian and Pakistani
  // impression data.
  description:
    'Breezer is a social snus and nicotine pouch app for iOS and Android. It tracks pouch consumption, ranks users on leaderboards, and includes a Quit Mode with a withdrawal timeline, savings and health milestones.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Am Sonnenhang 2',
    addressLocality: 'Sankt Leonhard am Forst',
    postalCode: '3243',
    addressCountry: 'AT',
  },
  sameAs: [
    'https://www.instagram.com/breezer.now',
    'https://www.tiktok.com/@breezerapp',
    'https://apps.apple.com/at/app/breezer/id6737725511',
    'https://play.google.com/store/apps/details?id=com.breezerapp.breezer',
  ],
} as const;

export const website = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: 'Breezer',
  inLanguage: SITE_LANGUAGES,
  publisher: { '@id': `${SITE}/#organization` },
} as const;

export const mobileApp = {
  '@type': 'MobileApplication',
  '@id': `${SITE}/#app`,
  name: 'Breezer',
  alternateName: ['Breezer Snus App', 'Breezer Snus Tracker', 'Social Snus App', 'Snus Quit App'],
  operatingSystem: 'iOS, Android',
  applicationCategory: 'LifestyleApplication',
  applicationSubCategory: 'Health & Fitness',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
  url: `${SITE}/`,
  downloadUrl: [
    'https://apps.apple.com/at/app/breezer/id6737725511',
    'https://play.google.com/store/apps/details?id=com.breezerapp.breezer',
  ],
  installUrl: `${SITE}/invite`,
  description:
    'Breezer is the first social snus app for iOS and Android. Track your snus consumption with one tap, compete with friends on global leaderboards, earn rewards, and quit snus with a dedicated Quit Mode that tracks days snus-free, money saved, and health milestones.',
  image: `${SITE}/images/og-image.png`,
  inLanguage: SITE_LANGUAGES,
  featureList: [
    'Snus usage tracking and analytics',
    'Global and local leaderboards',
    'Social features and friend connections',
    'Quitting mode with health tracking',
    'Exclusive promotions and rewards',
    'Real-time notifications',
    'Visual statistics and progress charts',
    'Achievement system and milestones',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '27',
    bestRating: '5',
    worstRating: '1',
  },
  author: { '@id': `${SITE}/#organization` },
  publisher: { '@id': `${SITE}/#organization` },
} as const;

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, SITE).href,
    })),
  };
}

export function faqPage(qa: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: qa.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
