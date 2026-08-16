import type { Lang } from '../i18n/ui';

/**
 * Byline registry.
 *
 * Google's guidance asks for visible information about who stands behind a page,
 * which matters more here than elsewhere because nicotine cessation is a health
 * topic. So `Article.astro` renders a visible box and a matching schema node
 * whenever the frontmatter `author` matches a key here.
 *
 * `isPerson` decides the schema shape, and it is not cosmetic. A brand byline
 * emitted as a schema.org Person is a machine-readable claim that a human of
 * that name wrote the piece. For an editorial byline that claim is false, so
 * those entries point at the organisation instead. The same reasoning is why
 * there is no stock or AI-generated headshot here: an invented face on health
 * content is a fabricated trust signal, and Google treats it as one.
 *
 * Names not listed fall back to the organisation with no visible box, which is
 * the right behaviour for the evergreen guide pages: they describe the product
 * rather than carrying a viewpoint.
 */
export interface Author {
  /** Display name per language. The registry key is the frontmatter value. */
  displayName: Record<Lang, string>;
  /** false emits the organisation reference instead of a Person node. */
  isPerson: boolean;
  /** Where a reader can check who is behind this. */
  url: string;
  /** Path under /public. Omit rather than inventing a face. */
  image?: string;
  role: Record<Lang, string>;
  /** Answers one question only: why is this the byline you can trust here. */
  bio: Record<Lang, string>;
  sameAs?: string[];
}

export const authors: Record<string, Author> = {
  'Breezer Redakteur': {
    displayName: {
      de: 'Breezer Redakteur',
      en: 'Breezer Editorial',
    },
    isPerson: false,
    // The imprint carries the legally required identity, so it is the honest
    // target: a reader who wants a name finds one there.
    url: 'https://breezer.now/imprint',
    image: '/images/author-breezer.png',
    role: {
      de: 'Redaktion von Breezer',
      en: 'Editorial team at Breezer',
    },
    bio: {
      de: 'Hinter Breezer steht eine Person in Niederösterreich, die die App baut und die Studien für diese Artikel selbst liest. Die Zahlen hier stammen aus derselben Arbeit: aus der Forschung hinter den Gesundheitsfunktionen und aus den Konsummustern, die die App sichtbar macht. Wo die Evidenz dünn ist, steht das hier so drin, statt aufgerundet zu werden.',
      en: 'Breezer is built by one person in Lower Austria, who also reads the studies behind these articles. The numbers here come out of that same work: the research behind the health features, and the consumption patterns the app makes visible. Where the evidence is thin, these articles say so instead of rounding it up.',
    },
  },
};

/** Undefined for unlisted names, which is the signal to fall back to the organisation. */
export const getAuthor = (name?: string): Author | undefined =>
  name ? authors[name] : undefined;
