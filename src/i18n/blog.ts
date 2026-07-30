import type { Lang } from './routes';

/** Copy for the blog hub, kept out of the page templates so both locales stay in step. */
export const blogCopy: Record<Lang, {
  title: string; description: string; h1: string; intro: string;
  postsHeading: string; guidesHeading: string; guidesIntro: string;
  empty: string; emptyTitle: string; ctaHeading: string; ctaBody: string; crumbHome: string;
}> = {
  en: {
    title: 'Snus Blog: Guides, Tips & Research | Breezer',
    description:
      'Guides on tracking snus, quitting nicotine pouches, and understanding your habit. From the team behind Breezer, the free social snus app.',
    h1: 'The Breezer Snus Blog',
    intro:
      'Practical guides on tracking your snus, cutting back, and quitting for good — plus comparisons of the tools that claim to help.',
    postsHeading: 'Latest articles',
    guidesHeading: 'Guides & comparisons',
    guidesIntro: 'Our evergreen deep-dives on tracking, quitting, and choosing a snus app.',
    emptyTitle: 'First articles are in the works',
    empty: 'We are writing them now. In the meantime, the guides below cover tracking, quitting and choosing an app.',
    ctaHeading: 'Track your snus for free',
    ctaBody: 'Download Breezer and see where your habit actually stands.',
    crumbHome: 'Snus App',
  },
  de: {
    title: 'Snus Blog: Guides, Tipps & Wissen | Breezer',
    description:
      'Guides zum Snus tracken, zum Aufhören mit Nikotinbeuteln und zum Verstehen deines Konsums. Vom Team hinter Breezer, der sozialen Snus App.',
    h1: 'Der Breezer Snus Blog',
    intro:
      'Praktische Guides zum Tracken, Reduzieren und Aufhören — dazu Vergleiche der Apps, die dabei helfen wollen.',
    postsHeading: 'Neueste Artikel',
    guidesHeading: 'Guides & Vergleiche',
    guidesIntro: 'Unsere ausführlichen Ratgeber zum Tracken, Aufhören und zur App-Wahl.',
    emptyTitle: 'Die ersten Artikel entstehen gerade',
    empty: 'Wir schreiben sie gerade. Solange findest du in den Guides unten alles zu Tracking, Aufhören und App-Wahl.',
    ctaHeading: 'Snus kostenlos tracken',
    ctaBody: 'Lade Breezer und sieh, wo dein Konsum wirklich steht.',
    crumbHome: 'Snus App',
  },
};
