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
 * That rule is about *invented* faces. A line drawing of a real, named person
 * is not one, and it is the reason the personal byline carries an illustration
 * rather than a photograph: the accountability is real, the biometric exposure
 * is not. § 5 ECG already publishes the same name in the imprint, so the
 * byline adds no identifiability, only attribution.
 *
 * The bios say how the articles are made, including the AI involvement. That
 * belongs in the bio and not in the byline: a byline is an accountability
 * claim, and a model cannot be held to one. Putting a model in `author` would
 * also be a false statement in the structured data, which is the same defect
 * as an invented headshot wearing a different hat.
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
  /**
   * Paint the image through a CSS mask in the brand gradient. Only for line
   * art on a transparent background: a photograph masked this way becomes a
   * silhouette.
   */
  tinted?: boolean;
  /**
   * A second crop for the byline bubble. The same drawing scaled down loses
   * its features at that size, so this one is cropped to the face alone and
   * carries heavier strokes. Two files rather than one because an avatar and a
   * favicon-sized mark are different jobs, and tuning one to serve both makes
   * both worse.
   */
  imageSmall?: string;
  role: Record<Lang, string>;
  /** Answers one question only: why is this the byline you can trust here. */
  bio: Record<Lang, string>;
  sameAs?: string[];
}

export const authors: Record<string, Author> = {
  'Klaus Siebeneicher': {
    /**
     * First name only, and the same string goes into schema.org Person.name.
     * The full name and address are in the imprint, one click away through
     * `url`, so nothing is hidden. What it costs is entity resolution: "Klaus"
     * cannot be matched against mentions elsewhere the way a full name can.
     * The alternative, showing one name and marking up another, is a
     * visible/markup mismatch and worse than either choice on its own.
     */
    displayName: {
      de: 'Klaus',
      en: 'Klaus',
    },
    isPerson: true,
    url: 'https://breezer.now/imprint',
    image: '/images/author-klaus.png',
    imageSmall: '/images/author-klaus-face.png',
    tinted: true,
    role: {
      de: 'Gründer von Breezer',
      en: 'Founder of Breezer',
    },
    bio: {
      de: 'Baut Breezer allein in Niederösterreich, liest die Studien hinter diesen Artikeln selbst und benennt dünne Evidenz, statt sie aufzurunden. Recherche und Rohentwurf entstehen mit KI-Unterstützung; jede zitierte Quelle wird einzeln geöffnet und geprüft, und die Einschätzung am Ende ist seine.',
      en: 'Builds Breezer single-handed in Lower Austria, reads the studies behind these articles himself, and says where the evidence is thin instead of rounding it up. Research and first drafts are produced with AI assistance; every cited source is opened and checked individually, and the judgement at the end is his.',
    },
    // sameAs is deliberately empty until the real profile URLs are known. A
    // guessed URL here is a machine-readable claim that this person is that
    // account, which is the same class of defect as an invented headshot.
  },
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
      de: 'Hinter Breezer steht eine Person in Niederösterreich, die die App baut, die Studien für diese Artikel selbst liest und dünne Evidenz benennt, statt sie aufzurunden.',
      en: 'Breezer is built by one person in Lower Austria, who also reads the studies behind these articles and says where the evidence is thin instead of rounding it up.',
    },
  },
};

/** Undefined for unlisted names, which is the signal to fall back to the organisation. */
export const getAuthor = (name?: string): Author | undefined =>
  name ? authors[name] : undefined;
