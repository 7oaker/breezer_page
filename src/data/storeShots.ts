/**
 * The store images: which pages exist, which images each page shows in which
 * order, the headline of every image in every language, and the formats.
 *
 * Rendered by /dev/store/[page]/[lang]/[device]/[frame] (dev server only) and
 * photographed by scripts/capture-store.mjs into react_Breezer/aso/shots/. The
 * listing texts live in react_Breezer/aso/, not here: this file only holds what
 * is printed on the images.
 *
 * Three pages per store, because Breezer has two audiences with opposite
 * intentions (decided 11.11.2026, Linear BRE-26/BRE-29):
 * - `default`: brand search and everything else, both paths. An image that
 *   belongs to one path says so with a small label and its icon.
 * - `track`: people searching for a tracker. Only the tracking path.
 * - `quit`: people searching to quit. Only the quitting path.
 *
 * Rules every image keeps (Klaus, 11.11.): one message, a headline of at most
 * five words, one phone, at most one enlarged detail, no sublines, no feature
 * lists, demo data only.
 *
 * `*so*` marks the accent of a headline: exactly one, always at the end,
 * because it gets a line of its own (components/store/Title.astro).
 */

/** The app's thirteen languages; every page exists in each of them. */
export const LANGS = ['en', 'de', 'it', 'pl', 'sv', 'no', 'cs', 'sk', 'sl', 'hr', 'da', 'fi', 'hu'] as const;
export type Lang = (typeof LANGS)[number];

/**
 * The language as it appears in the store route's URL. English is `en-GB`, not
 * `en`: the site's i18n config makes English the unprefixed default, and Astro
 * then answers every path with an `en` segment with 404, the dev routes too.
 * en-GB is also the App Store's primary locale, so the name is not a stretch.
 */
export const urlLang = (lang: string): string => (lang === 'en' ? 'en-GB' : lang);
export const fromUrlLang = (segment: string): string => (segment === 'en-GB' ? 'en' : segment);

export type Path = 'track' | 'quit' | 'both';

/**
 * The look is the one Breezer's store listing has always had, which Klaus asked
 * to go back to (11.11.2026): Breezer's blue as a gradient behind everything,
 * white type on it, dark phones that stand out. One colour for every image and
 * both paths; the path label's word tells them apart. A second colour for
 * quitting (mint, then the app's green) was tried twice and rejected twice.
 */
export const BRAND_STOPS = '#3FC3FB 0%, #2196F0 50%, #1460D2 100%';
export const brandGradient = (angle = 165): string => `linear-gradient(${angle}deg, ${BRAND_STOPS})`;
const BRAND = {
  solid: '#FFFFFF',
  glow: 'rgb(255 255 255 / 0.18)',
  text: '#FFFFFF',
};
export const PATH_COLOR: Record<Path, { solid: string; glow: string; text: string }> = {
  track: BRAND,
  quit: BRAND,
  both: BRAND,
};

export type FrameId =
  | 'press'
  | 'stats'
  | 'quit'
  | 'widgets'
  | 'community'
  | 'ranking'
  | 'games'
  | 'journey'
  | 'health'
  | 'craving'
  | 'chat'
  | 'goals'
  | 'merch';

/** Which path a frame belongs to, which is what it is coloured as on the default page. */
export const FRAME_PATH: Record<FrameId, Path> = {
  press: 'track',
  stats: 'track',
  quit: 'quit',
  widgets: 'both',
  community: 'both',
  ranking: 'track',
  games: 'both',
  journey: 'quit',
  health: 'quit',
  craving: 'quit',
  chat: 'quit',
  goals: 'quit',
  merch: 'both',
};

export type PageId = 'default' | 'track' | 'quit';

/**
 * Order is conversion: the search results show the first three, so those carry
 * the reason to download. On the default page that is both paths (decided
 * 10.11.: press, stats, quit).
 */
export const PAGES: Record<PageId, FrameId[]> = {
  default: ['press', 'stats', 'quit', 'widgets', 'community', 'journey', 'games', 'merch'],
  track: ['press', 'stats', 'widgets', 'ranking', 'community', 'games', 'merch'],
  /* `health` replaced `craving` (Klaus, 11.11.2026): symptoms easing and the body
     recovering say more to somebody about to quit than a list of exercises. */
  quit: ['quit', 'journey', 'health', 'widgets', 'chat', 'goals', 'merch'],
};

/** The path one image belongs to: the page's own on a pure page, the frame's on the default page. */
export function pathOf(page: PageId, frame: FrameId): Path {
  return page === 'default' ? FRAME_PATH[frame] : page;
}

/** The small label above the headline. Only the default page needs one, and only for one path. */
export function labelOf(page: PageId, frame: FrameId): Exclude<Path, 'both'> | null {
  if (page !== 'default') return null;
  const path = FRAME_PATH[frame];
  return path === 'both' ? null : path;
}

export type DeviceId = 'iphone' | 'android';

export interface Device {
  id: DeviceId;
  store: 'apple' | 'google';
  /** Folder under aso/shots/<page>/<store>/<lang>/. */
  folder: string;
  os: 'ios' | 'android';
  /** CSS px of the image; times `scale` gives the pixels the store asks for. */
  width: number;
  height: number;
  scale: number;
}

export const DEVICES: Device[] = [
  // App Store: the 6.9" set is the one required size, Apple scales it down for the rest.
  { id: 'iphone', store: 'apple', folder: 'iphone-6.9', os: 'ios', width: 440, height: 956, scale: 3 },
  // Play: 9:16 at 1080 x 1920.
  { id: 'android', store: 'google', folder: 'phone', os: 'android', width: 360, height: 640, scale: 3 },
];

interface Copy {
  /** The two path labels, the app's own words from `onboarding.track` and `onboarding.quit`. */
  labels: Record<'track' | 'quit', string>;
  headlines: Record<FrameId, string>;
  /**
   * The line under the logo on the iOS 27 header, the search results asset and
   * the Play feature graphic, per page (src/pages/dev/store/[page]/[lang]/promo/
   * [kind].astro). Apple's rules for those: short, legible, no prices, no other
   * platforms' logos; Google's: no ranking or performance claims ("#1").
   */
  promo: Record<PageId, string>;
  /** A different headline for a frame on one page, where the page's audience needs other words. */
  overrides?: Partial<Record<PageId, Partial<Record<FrameId, string>>>>;
  /**
   * The header and search videos (motion/[kind].astro): the word over the chat
   * scene. With the two labels it makes the end line, "Tracken. Aufhören.
   * Gemeinsam.", cut to the scenes a page shows.
   */
  motion: { together: string };
}

// <copy> generated by scripts/sync-store-copy.mjs from react_Breezer/aso/screens-copy/, do not edit here
export const COPY: Partial<Record<Lang, Copy>> = {
  "en": {
    "labels": {
      "track": "Track",
      "quit": "Quit"
    },
    "headlines": {
      "press": "One tap. *Counted.*",
      "stats": "See what you *really take.*",
      "quit": "Or quit *for good.*",
      "widgets": "All in view, *no app.*",
      "community": "Join the *community.*",
      "ranking": "Take on *your friends.*",
      "games": "Play for *new looks.*",
      "journey": "Every day *counts.*",
      "health": "Watch your body *recover.*",
      "craving": "Help for *every craving.*",
      "chat": "You don't quit *alone.*",
      "goals": "Save up for *something real.*",
      "merch": "Win *Breezer merch.*"
    },
    "overrides": {
      "track": {
        "widgets": "Track it, *no app.*"
      },
      "quit": {
        "quit": "Snus-free, *at last.*",
        "widgets": "Your streak, *always in view.*"
      }
    },
    "promo": {
      "default": "Track your snus. *Or quit for good.*",
      "track": "Every pouch, *one tap.*",
      "quit": "Quit snus, *for good.*"
    },
    "motion": {
      "together": "Together"
    }
  },
  "de": {
    "labels": {
      "track": "Tracken",
      "quit": "Aufhören"
    },
    "headlines": {
      "press": "Ein Tipp. *Gezählt.*",
      "stats": "Sieh, was du *wirklich nimmst.*",
      "quit": "Oder hör *ganz auf.*",
      "widgets": "Alles im Blick, *ohne App.*",
      "community": "Werde Teil der *Community.*",
      "ranking": "Miss dich mit *deinen Freunden.*",
      "games": "Spiel um *neue Looks.*",
      "journey": "Jeder Tag *zählt.*",
      "health": "Dein Körper *erholt sich.*",
      "craving": "Hilfe bei *Verlangen.*",
      "chat": "Du hörst *nicht allein auf.*",
      "goals": "Spar auf *etwas Echtes.*",
      "merch": "Gewinn *Breezer-Merch.*"
    },
    "overrides": {
      "track": {
        "widgets": "Tracken, *ohne App.*"
      },
      "quit": {
        "quit": "Endlich *snusfrei.*",
        "widgets": "Deine Streak, *immer im Blick.*"
      }
    },
    "promo": {
      "default": "Tracke deinen Snus. *Oder hör ganz auf.*",
      "track": "Jeder Beutel, *ein Tipp.*",
      "quit": "Aufhören, *für immer.*"
    },
    "motion": {
      "together": "Gemeinsam"
    }
  },
  "it": {
    "labels": {
      "track": "Monitora",
      "quit": "Smetti"
    },
    "headlines": {
      "press": "Un tocco. *Contato.*",
      "stats": "Guarda cosa *prendi davvero.*",
      "quit": "Oppure smetti *del tutto.*",
      "widgets": "Tutto sott'occhio, *senza app.*",
      "community": "Entra nella *community.*",
      "ranking": "Sfida *i tuoi amici.*",
      "games": "Gioca per *nuovi look.*",
      "journey": "Ogni giorno *conta.*",
      "health": "Il tuo corpo *si riprende.*",
      "craving": "Aiuto per *ogni voglia.*",
      "chat": "Smetti *in compagnia.*",
      "goals": "Risparmia per *qualcosa di vero.*",
      "merch": "Vinci il *merch Breezer.*"
    },
    "overrides": {
      "track": {
        "widgets": "Monitora, *senza app.*"
      },
      "quit": {
        "quit": "Finalmente *senza snus.*",
        "widgets": "La tua serie, *sempre lì.*"
      }
    },
    "promo": {
      "default": "Monitora il tuo snus. *O smetti del tutto.*",
      "track": "Ogni bustina, *un tocco.*",
      "quit": "Smetti con lo snus, *per sempre.*"
    },
    "motion": {
      "together": "Insieme"
    }
  },
  "pl": {
    "labels": {
      "track": "Śledź",
      "quit": "Rzuć"
    },
    "headlines": {
      "press": "Stuknij. *Policzone.*",
      "stats": "Zobacz, *ile bierzesz.*",
      "quit": "Albo rzuć *na dobre.*",
      "widgets": "Wszystko widać, *bez aplikacji.*",
      "community": "Dołącz do *społeczności.*",
      "ranking": "Zmierz się *ze znajomymi.*",
      "games": "Graj o *nowy wygląd.*",
      "journey": "Każdy dzień *się liczy.*",
      "health": "Twoje ciało *wraca do formy.*",
      "craving": "Pomoc na *każdy głód.*",
      "chat": "Nie rzucasz *w pojedynkę.*",
      "goals": "Odkładaj na *coś realnego.*",
      "merch": "Wygraj *merch Breezer.*"
    },
    "overrides": {
      "track": {
        "widgets": "Śledź, *bez aplikacji.*"
      },
      "quit": {
        "quit": "Wreszcie *bez snusa.*",
        "widgets": "Seria zawsze *na widoku.*"
      }
    },
    "promo": {
      "default": "Licz swój snus. *Albo rzuć na dobre.*",
      "track": "Każdy woreczek, *jedno stuknięcie.*",
      "quit": "Rzuć snus, *na zawsze.*"
    },
    "motion": {
      "together": "Razem"
    }
  },
  "sv": {
    "labels": {
      "track": "Logga",
      "quit": "Sluta"
    },
    "headlines": {
      "press": "Ett tryck. *Räknat.*",
      "stats": "Se vad du *faktiskt tar.*",
      "quit": "Eller sluta *för gott.*",
      "widgets": "Allt i sikte, *utan app.*",
      "community": "Häng med i *communityt.*",
      "ranking": "Utmana *dina vänner.*",
      "games": "Spela för *nya teman.*",
      "journey": "Varje dag *räknas.*",
      "health": "Din kropp *återhämtar sig.*",
      "craving": "Hjälp mot *varje sug.*",
      "chat": "Du slutar *inte ensam.*",
      "goals": "Spara till *något på riktigt.*",
      "merch": "Vinn *Breezer-merch.*"
    },
    "overrides": {
      "track": {
        "widgets": "Logga, *utan app.*"
      },
      "quit": {
        "quit": "Äntligen *snusfri.*",
        "widgets": "Din svit, *alltid i sikte.*"
      }
    },
    "promo": {
      "default": "Logga ditt snus. *Eller sluta för gott.*",
      "track": "Varje påse, *ett tryck.*",
      "quit": "Sluta snusa, *för gott.*"
    },
    "motion": {
      "together": "Tillsammans"
    }
  },
  "no": {
    "labels": {
      "track": "Spor",
      "quit": "Slutt"
    },
    "headlines": {
      "press": "Ett trykk. *Talt.*",
      "stats": "Se hva du *faktisk tar.*",
      "quit": "Eller slutt *for godt.*",
      "widgets": "Full oversikt, *uten app.*",
      "community": "Bli med i *fellesskapet.*",
      "ranking": "Utfordre *vennene dine.*",
      "games": "Spill deg til *nye temaer.*",
      "journey": "Hver dag *teller.*",
      "health": "Kroppen din *henter seg inn.*",
      "craving": "Hjelp når *suget kommer.*",
      "chat": "Du slutter *ikke alene.*",
      "goals": "Spar til *noe ekte.*",
      "merch": "Vinn *Breezer-merch.*"
    },
    "overrides": {
      "track": {
        "widgets": "Logg det, *uten app.*"
      },
      "quit": {
        "quit": "Endelig *snusfri.*",
        "widgets": "Streaken din, *alltid synlig.*"
      }
    },
    "promo": {
      "default": "Spor snusen din. *Eller slutt for godt.*",
      "track": "Hver pose, *ett trykk.*",
      "quit": "Slutt med snus, *for godt.*"
    },
    "motion": {
      "together": "Sammen"
    }
  },
  "cs": {
    "labels": {
      "track": "Sledovat",
      "quit": "Přestat"
    },
    "headlines": {
      "press": "Jedno ťuknutí. *Zapsáno.*",
      "stats": "Uvidíš, *kolik bereš.*",
      "quit": "Nebo přestaň *nadobro.*",
      "widgets": "Vše na očích, *bez aplikace.*",
      "community": "Přidej se *ke komunitě.*",
      "ranking": "Změř síly *s přáteli.*",
      "games": "Hraj o *nové motivy.*",
      "journey": "Každý den *se počítá.*",
      "health": "Tvé tělo *se zotavuje.*",
      "craving": "Pomoc při *každé chuti.*",
      "chat": "Přestáváme *spolu.*",
      "goals": "Šetři na *něco svého.*",
      "merch": "Vyhraj *Breezer merch.*"
    },
    "overrides": {
      "track": {
        "widgets": "Zapisuj *bez aplikace.*"
      },
      "quit": {
        "quit": "Konečně *bez snusu.*",
        "widgets": "Tvoje série, *vždy na očích.*"
      }
    },
    "promo": {
      "default": "Sleduj svůj snus. *Nebo přestaň nadobro.*",
      "track": "Každý sáček, *jedno ťuknutí.*",
      "quit": "Přestaň se snusem, *navždy.*"
    },
    "motion": {
      "together": "Společně"
    }
  },
  "sk": {
    "labels": {
      "track": "Sledovať",
      "quit": "Prestať"
    },
    "headlines": {
      "press": "Jedno ťuknutie. *Zapísané.*",
      "stats": "Pozri, koľko *naozaj berieš.*",
      "quit": "Alebo prestaň *nadobro.*",
      "widgets": "Prehľad *bez aplikácie.*",
      "community": "Pridaj sa *ku komunite.*",
      "ranking": "Zmeraj si sily *s priateľmi.*",
      "games": "Hraj o *nové témy.*",
      "journey": "Každý deň *sa počíta.*",
      "health": "Tvoje telo *sa zotavuje.*",
      "craving": "Pomoc pri *každej chuti.*",
      "chat": "Prestávame *spolu.*",
      "goals": "Šetri na *niečo skutočné.*",
      "merch": "Vyhraj *Breezer merch.*"
    },
    "overrides": {
      "track": {
        "widgets": "Zapisuj *bez aplikácie.*"
      },
      "quit": {
        "quit": "Konečne *bez snusu.*",
        "widgets": "Tvoja séria, *vždy na očiach.*"
      }
    },
    "promo": {
      "default": "Sleduj svoj snus. *Alebo prestaň nadobro.*",
      "track": "Každé vrecko, *jedno ťuknutie.*",
      "quit": "Prestaň so snusom, *navždy.*"
    },
    "motion": {
      "together": "Spolu"
    }
  },
  "sl": {
    "labels": {
      "track": "Spremljaj",
      "quit": "Opusti"
    },
    "headlines": {
      "press": "En tap. *Zabeleženo.*",
      "stats": "Poglej, koliko *res porabiš.*",
      "quit": "Ali pa opusti *za vedno.*",
      "widgets": "Vse na očeh, *brez aplikacije.*",
      "community": "Pridruži se *skupnosti.*",
      "ranking": "Tekmuj s *prijatelji.*",
      "games": "Igraj za *nov videz.*",
      "journey": "Vsak dan *šteje.*",
      "health": "Tvoje telo *okreva.*",
      "craving": "Pomoč ob *vsaki želji.*",
      "chat": "Opuščaš *v dobri družbi.*",
      "goals": "Prihrani za *nekaj pravega.*",
      "merch": "Osvoji *Breezer merch.*"
    },
    "overrides": {
      "track": {
        "widgets": "Beleži *brez aplikacije.*"
      },
      "quit": {
        "quit": "Končno *brez snusa.*",
        "widgets": "Tvoj niz, *vedno na očeh.*"
      }
    },
    "promo": {
      "default": "Spremljaj svoj snus. *Ali ga opusti.*",
      "track": "Vsaka vrečka, *en tap.*",
      "quit": "Opusti snus, *za vedno.*"
    },
    "motion": {
      "together": "Skupaj"
    }
  },
  "hr": {
    "labels": {
      "track": "Prati",
      "quit": "Ostavi"
    },
    "headlines": {
      "press": "Jedan dodir. *Zabilježeno.*",
      "stats": "Vidi koliko *stvarno uzimaš.*",
      "quit": "Ili prestani *zauvijek.*",
      "widgets": "Sve na oku, *bez aplikacije.*",
      "community": "Pridruži se *zajednici.*",
      "ranking": "Izazovi *svoje prijatelje.*",
      "games": "Igraj za *novi izgled.*",
      "journey": "Svaki dan *se računa.*",
      "health": "Tvoje tijelo *se oporavlja.*",
      "craving": "Pomoć kod *svake žudnje.*",
      "chat": "Zajedno *je lakše.*",
      "goals": "Štedi za *nešto stvarno.*",
      "merch": "Osvoji *Breezer merch.*"
    },
    "overrides": {
      "track": {
        "widgets": "Prati, *bez aplikacije.*"
      },
      "quit": {
        "quit": "Napokon *bez snusa.*",
        "widgets": "Tvoj niz, *uvijek na oku.*"
      }
    },
    "promo": {
      "default": "Prati svoj snus. *Ili prestani zauvijek.*",
      "track": "Svaka vrećica, *jedan dodir.*",
      "quit": "Prestani sa snusom, *zauvijek.*"
    },
    "motion": {
      "together": "Zajedno"
    }
  },
  "da": {
    "labels": {
      "track": "Track",
      "quit": "Stop"
    },
    "headlines": {
      "press": "Ét tryk. *Talt.*",
      "stats": "Se, hvad du *faktisk tager.*",
      "quit": "Eller stop *helt.*",
      "widgets": "Fuldt overblik, *uden app.*",
      "community": "Bliv en del af *fællesskabet.*",
      "ranking": "Udfordr *dine venner.*",
      "games": "Spil dig til *nye temaer.*",
      "journey": "Hver dag *tæller.*",
      "health": "Din krop *kommer sig.*",
      "craving": "Hjælp mod *trangen.*",
      "chat": "Du stopper *ikke alene.*",
      "goals": "Spar op til *noget ægte.*",
      "merch": "Vind *Breezer-merch.*"
    },
    "overrides": {
      "track": {
        "widgets": "Log det, *uden app.*"
      },
      "quit": {
        "quit": "Endelig *snusfri.*",
        "widgets": "Din stime, *altid synlig.*"
      }
    },
    "promo": {
      "default": "Track din snus. *Eller stop helt.*",
      "track": "Hver pose, *ét tryk.*",
      "quit": "Stop med snus, *for altid.*"
    },
    "motion": {
      "together": "Sammen"
    }
  },
  "fi": {
    "labels": {
      "track": "Seuraa",
      "quit": "Lopeta"
    },
    "headlines": {
      "press": "Yksi napautus. *Laskettu.*",
      "stats": "Näe, mitä *oikeasti käytät.*",
      "quit": "Tai lopeta *kokonaan.*",
      "widgets": "Kaikki näkyvillä *ilman sovellusta.*",
      "community": "Liity *yhteisöön.*",
      "ranking": "Haasta *kaverisi.*",
      "games": "Pelaa itsellesi *uusia teemoja.*",
      "journey": "Jokainen päivä *lasketaan.*",
      "health": "Kehosi *toipuu.*",
      "craving": "Apua *himoon.*",
      "chat": "Et lopeta *yksin.*",
      "goals": "Säästä *unelmaan.*",
      "merch": "Voita *Breezer-paita.*"
    },
    "overrides": {
      "track": {
        "widgets": "Kirjaa *ilman sovellusta.*"
      },
      "quit": {
        "quit": "Vihdoin *nuuskaton.*",
        "widgets": "Putkesi *aina näkyvillä.*"
      }
    },
    "promo": {
      "default": "Seuraa nuuskaasi. *Tai lopeta kokonaan.*",
      "track": "Jokainen pussi, *yksi napautus.*",
      "quit": "Lopeta nuuska, *lopullisesti.*"
    },
    "motion": {
      "together": "Yhdessä"
    }
  },
  "hu": {
    "labels": {
      "track": "Követés",
      "quit": "Leszokás"
    },
    "headlines": {
      "press": "Egy koppintás. *Megszámolva.*",
      "stats": "A valós *számaid.*",
      "quit": "Vagy szokj le *végleg.*",
      "widgets": "Mindig *szem előtt.*",
      "community": "Csatlakozz a *közösséghez.*",
      "ranking": "Versenyezz *a barátaiddal.*",
      "games": "Játssz *új külsőkért.*",
      "journey": "Minden nap *számít.*",
      "health": "A tested *regenerálódik.*",
      "craving": "Segítség *sóvárgásnál.*",
      "chat": "Nem egyedül *szoksz le.*",
      "goals": "Gyűjts valami *igazira.*",
      "merch": "Nyerj *Breezer cuccot.*"
    },
    "overrides": {
      "track": {
        "widgets": "Követés, *app nélkül.*"
      },
      "quit": {
        "quit": "Végre *snusmentes.*",
        "widgets": "Látod *a sorozatod.*"
      }
    },
    "promo": {
      "default": "Kövesd a snusozást. *Vagy szokj le végleg.*",
      "track": "Minden tasak, *egy koppintás.*",
      "quit": "Leszokás, *örökre.*"
    },
    "motion": {
      "together": "Együtt"
    }
  }
};
// </copy>

/** True once a language has its own headlines. The capture script skips the others. */
export function hasCopy(lang: string): boolean {
  return lang in COPY;
}

/**
 * The copy for `lang`. A language without its own headlines previews with the
 * German ones (handy for checking how the app's words fit), but is never
 * captured: see hasCopy().
 */
export function copyFor(lang: Lang): Copy {
  return COPY[lang] ?? COPY.de!;
}

/** The formats. CSS size times `scale` is what the store asks for; the feature graphic is downscaled after. */
export const PROMOS = [
  { kind: 'header', store: 'apple', file: 'header.png', width: 1920, height: 823, scale: 2, out: [3840, 1646] },
  { kind: 'search', store: 'apple', file: 'search.png', width: 1920, height: 1280, scale: 2, out: [3840, 2560] },
  { kind: 'feature', store: 'google', file: 'feature-graphic.png', width: 1024, height: 500, scale: 2, out: [1024, 500] },
] as const;

/** The App Store's two videos per page and language (src/pages/dev/store/[page]/[lang]/motion/[kind].astro), in CSS px, filmed at 2x. */
export const MOTIONS = [
  { kind: 'header', file: 'header.mp4', width: 1920, height: 823, scale: 2 },
  { kind: 'search', file: 'search.mp4', width: 1920, height: 1280, scale: 2 },
] as const;

export function headlineFor(lang: Lang, page: PageId, frame: FrameId): string {
  const copy = copyFor(lang);
  return copy.overrides?.[page]?.[frame] ?? copy.headlines[frame];
}
