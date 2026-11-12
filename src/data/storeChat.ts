/**
 * The invented chat lines in the store images and videos, in all thirteen app
 * languages: one place, so the chat screenshot, the community screenshot and the
 * header video can never tell the same story in different words.
 *
 * Every name is invented. Written as people write in a chat, not translated
 * word for word; the emoji is always the last thing on the line.
 */

export type ChatWho = 'lena' | 'marek' | 'sofia' | 'alex';

/**
 * Day 3 asks how to get through the evening, two people who are further along
 * answer, and the viewer (Alex, 24 days) adds a line of their own. Day 3 is
 * where the app's own urge surfing says withdrawal peaks, so Marek's answer is
 * the app's claim too, not a pep talk. His line starts with a mention of Lena,
 * which MessageCard draws in the accent, underlined.
 *
 * Alex's line is one short line on purpose: the Play format shows less of the
 * screen, and Lena's question at the top is the line that must not be cut.
 */
export const CHAT_THREAD: Record<string, Record<ChatWho, string>> = {
  en: {
    lena: 'Day 3 and the evenings are rough. Any tips?',
    marek: 'Day 3 is the peak. From here it only gets easier.',
    sofia: 'What helped me: a walk right after dinner.',
    alex: 'Day 24 here. Hang in there! 💪',
  },
  de: {
    lena: 'Tag 3 und die Abende sind echt hart. Tipps?',
    marek: 'Tag 3 ist der Höhepunkt. Ab jetzt wird’s nur leichter.',
    sofia: 'Mir hat ein Spaziergang nach dem Essen geholfen.',
    alex: 'Tag 24 hier. Halte durch! 💪',
  },
  it: {
    lena: 'Giorno 3 e le serate sono durissime. Consigli?',
    marek: 'Il terzo giorno è il picco. Da qui è solo in discesa.',
    sofia: 'A me ha aiutato una passeggiata dopo cena.',
    alex: 'Giorno 24 per me. Tieni duro! 💪',
  },
  pl: {
    lena: 'Dzień 3 i wieczory są najgorsze. Macie jakieś rady?',
    marek: 'Dzień 3 to szczyt. Od teraz będzie już tylko łatwiej.',
    sofia: 'Mnie pomagał spacer zaraz po kolacji.',
    alex: 'U mnie dzień 24. Trzymaj się! 💪',
  },
  sv: {
    lena: 'Dag 3 och kvällarna är värst. Några tips?',
    marek: 'Dag 3 är toppen. Härifrån blir det bara lättare.',
    sofia: 'Det som hjälpte mig: en promenad efter middagen.',
    alex: 'Dag 24 här. Håll ut! 💪',
  },
  no: {
    lena: 'Dag 3, og kveldene er verst. Noen tips?',
    marek: 'Dag 3 er toppen. Herfra blir det bare lettere.',
    sofia: 'Det som hjalp meg: en tur rett etter middag.',
    alex: 'Dag 24 her. Hold ut! 💪',
  },
  cs: {
    lena: 'Třetí den a večery jsou nejhorší. Nějaké tipy?',
    marek: 'Třetí den je vrchol. Odteď už to bude jen lehčí.',
    sofia: 'Mně pomáhala procházka hned po večeři.',
    alex: 'Jsem na 24. dni. Vydrž! 💪',
  },
  sk: {
    lena: 'Tretí deň a večery sú najhoršie. Nejaké tipy?',
    marek: 'Tretí deň je vrchol. Odteraz to bude už len ľahšie.',
    sofia: 'Mne pomáhala prechádzka hneď po večeri.',
    alex: 'Som na 24. dni. Vydrž! 💪',
  },
  sl: {
    lena: 'Tretji dan in večeri so najhujši. Kakšen nasvet?',
    marek: 'Tretji dan je vrhunec. Od tu naprej bo samo lažje.',
    sofia: 'Meni je pomagal sprehod takoj po večerji.',
    alex: 'Sem na 24. dnevu. Vztrajaj! 💪',
  },
  hr: {
    lena: 'Treći dan i večeri su najgori. Imate neki savjet?',
    marek: 'Treći dan je vrhunac. Odavde je samo lakše.',
    sofia: 'Meni je pomogla šetnja odmah nakon večere.',
    alex: 'Ja sam na 24. danu. Izdrži! 💪',
  },
  da: {
    lena: 'Dag 3, og aftenerne er værst. Nogen tips?',
    marek: 'Dag 3 er toppen. Herfra bliver det kun lettere.',
    sofia: 'Mig hjalp en gåtur lige efter aftensmaden.',
    alex: 'Dag 24 her. Hold ud! 💪',
  },
  fi: {
    lena: 'Päivä 3 ja illat ovat pahimpia. Onko vinkkejä?',
    marek: 'Kolmas päivä on huippu. Tästä se vain helpottaa.',
    sofia: 'Minua auttoi kävely heti illallisen jälkeen.',
    alex: 'Päivä 24 täällä. Sinnittele! 💪',
  },
  hu: {
    lena: '3. nap, és az esték nagyon nehezek. Van tipp?',
    marek: 'A 3. nap a csúcs. Innen már csak könnyebb lesz.',
    sofia: 'Nekem a vacsora utáni séta segített.',
    alex: 'Nálam a 24. nap. Kitartás! 💪',
  },
};

/** Invented people. Initials on a colour, like Appwrite's generated avatars. */
export const CHAT_PEOPLE: Record<Exclude<ChatWho, 'alex'>, { name: string; color: string }> = {
  lena: { name: 'Lena', color: '#ec4899' },
  marek: { name: 'Marek', color: '#f59e0b' },
  sofia: { name: 'Sofia', color: '#8b5cf6' },
};

/** The squad's #2, from the reader's own country, so a Finnish image is not a German talking Finnish. */
export const MEMBER_LOCAL: Record<string, [string, string]> = {
  en: ['Noah', 'CH'],
  de: ['Jonas', 'DE'],
  it: ['Luca', 'IT'],
  pl: ['Kuba', 'PL'],
  sv: ['Linnea', 'SE'],
  no: ['Sindre', 'NO'],
  cs: ['Marek', 'CZ'],
  sk: ['Tomáš', 'SK'],
  sl: ['Matej', 'SI'],
  hr: ['Ivan', 'HR'],
  da: ['Mikkel', 'DK'],
  fi: ['Eetu', 'FI'],
  hu: ['Bence', 'HU'],
};

/** Default page: the member who quit, 30 days in, thanking the room. */
export const QUIT_MESSAGE: Record<string, string> = {
  en: '30 days snus-free today. Thanks for the push, squad 💪',
  de: 'Heute 30 Tage snusfrei. Danke fürs Pushen, Leute 💪',
  it: 'Oggi 30 giorni senza snus. Grazie della spinta, ragazzi 💪',
  pl: 'Dziś 30 dni bez snusa. Dzięki za wsparcie, ekipa 💪',
  sv: '30 dagar utan snus idag. Tack för peppen, gänget 💪',
  no: '30 dager snusfri i dag. Takk for støtten, folkens 💪',
  cs: 'Dnes 30 dní bez snusu. Díky za podporu, partičko 💪',
  sk: 'Dnes 30 dní bez snusu. Vďaka za podporu, partia 💪',
  sl: 'Danes 30 dni brez snusa. Hvala za podporo, ekipa 💪',
  hr: 'Danas 30 dana bez snusa. Hvala na podršci, ekipa 💪',
  da: '30 dage uden snus i dag. Tak for opbakningen, alle 💪',
  fi: 'Tänään 30 päivää ilman nuuskaa. Kiitos tsempeistä, porukka 💪',
  hu: 'Ma 30 napja snus nélkül. Köszi a biztatást, srácok 💪',
};

/** Track page: a tracker who stayed under their own daily limit. */
export const TRACK_MESSAGE: Record<string, string> = {
  en: 'A whole week under my daily limit 💪',
  de: 'Eine ganze Woche unter meinem Tageslimit 💪',
  it: 'Una settimana intera sotto il mio limite 💪',
  pl: 'Cały tydzień poniżej mojego limitu 💪',
  sv: 'En hel vecka under min dagsgräns 💪',
  no: 'En hel uke under dagsgrensa mi 💪',
  cs: 'Celý týden pod svým denním limitem 💪',
  sk: 'Celý týždeň pod svojím denným limitom 💪',
  sl: 'Cel teden pod svojo dnevno mejo 💪',
  hr: 'Cijeli tjedan ispod svog dnevnog limita 💪',
  da: 'En hel uge under min daglige grænse 💪',
  fi: 'Koko viikko päivärajan alla 💪',
  hu: 'Egy teljes hét a napi limitem alatt 💪',
};

/** The header video's track page: Alex answering the tracker above. */
export const TRACK_REPLY: Record<string, string> = {
  en: 'Nice one! Day 4 under mine 🙌',
  de: 'Stark! Bei mir Tag 4 unterm Limit 🙌',
  it: 'Grande! Io sono al giorno 4 sotto il limite 🙌',
  pl: 'Brawo! U mnie 4. dzień poniżej limitu 🙌',
  sv: 'Snyggt! Dag 4 under gränsen för mig 🙌',
  no: 'Bra jobba! Dag 4 under grensa for meg 🙌',
  cs: 'Paráda! Já mám 4. den pod limitem 🙌',
  sk: 'Paráda! Ja mám 4. deň pod limitom 🙌',
  sl: 'Super! Jaz sem 4. dan pod mejo 🙌',
  hr: 'Bravo! Ja sam 4. dan ispod limita 🙌',
  da: 'Flot! Dag 4 under grænsen for mig 🙌',
  fi: 'Hienoa! Minulla päivä 4 rajan alla 🙌',
  hu: 'Szép! Nálam a 4. nap a limit alatt 🙌',
};

/*
 * The squad room (the `community` image): Breezer's demo squad, Bangerz [BNGZ],
 * the members of SquadScreen's board. Oskar asks the room, the reader's own
 * countryman (MEMBER_LOCAL) reports, Mila answers him, Alex has the last word.
 */

/** Lea, the oldest line in the room, the one the top edge cuts. */
export const SQUAD_MORNING: Record<string, string> = {
  en: 'Morning, squad ☀️',
  de: 'Morgen, Squad ☀️',
  it: 'Buongiorno, squad ☀️',
  pl: 'Dzień dobry, ekipa ☀️',
  sv: 'God morgon, gänget ☀️',
  no: 'God morgen, gjengen ☀️',
  cs: 'Dobré ráno, partičko ☀️',
  sk: 'Dobré ráno, partia ☀️',
  sl: 'Dobro jutro, ekipa ☀️',
  hr: 'Dobro jutro, ekipa ☀️',
  da: 'Godmorgen, alle sammen ☀️',
  fi: 'Huomenta, porukka ☀️',
  hu: 'Jó reggelt, csapat ☀️',
};

/** Oskar opening the day in the squad room. */
export const SQUAD_ASK: Record<string, string> = {
  en: "Who's under their limit today? 👀",
  de: 'Wer ist heute alles unter dem Limit? 👀',
  it: 'Chi è sotto il limite oggi? 👀',
  pl: 'Kto dziś jest poniżej limitu? 👀',
  sv: 'Vilka håller sig under gränsen idag? 👀',
  no: 'Hvem holder seg under grensa i dag? 👀',
  cs: 'Kdo je dnes pod limitem? 👀',
  sk: 'Kto je dnes pod limitom? 👀',
  sl: 'Kdo je danes pod mejo? 👀',
  hr: 'Tko je danas ispod limita? 👀',
  da: 'Hvem holder sig under grænsen i dag? 👀',
  fi: 'Kuka pysyy tänään rajan alla? 👀',
  hu: 'Ki van ma a limit alatt? 👀',
};

/** Mila to the member who quit (default page), after an @mention. */
export const SQUAD_CHEER_QUIT: Record<string, string> = {
  en: 'Huge, respect! 🙌',
  de: 'Wahnsinn, Respekt! 🙌',
  it: 'Grandissimo, rispetto! 🙌',
  pl: 'Ogień, szacun! 🙌',
  sv: 'Grymt, respekt! 🙌',
  no: 'Råsterkt, respekt! 🙌',
  cs: 'Paráda, klobouk dolů! 🙌',
  sk: 'Paráda, klobúk dole! 🙌',
  sl: 'Noro, kapo dol! 🙌',
  hr: 'Ludilo, svaka čast! 🙌',
  da: 'Vildt, respekt! 🙌',
  fi: 'Huikeaa, respektiä! 🙌',
  hu: 'Durva, le a kalappal! 🙌',
};

/** Mila to the tracker (track page), after an @mention. */
export const SQUAD_CHEER_TRACK: Record<string, string> = {
  en: 'Respect! Catching up tomorrow 😂',
  de: 'Respekt! Morgen zieh ich nach 😂',
  it: 'Rispetto! Domani ti raggiungo 😂',
  pl: 'Szacun! Jutro cię dogonię 😂',
  sv: 'Respekt! I morgon hänger jag på 😂',
  no: 'Respekt! I morgen henger jeg med 😂',
  cs: 'Klobouk dolů! Zítra tě doženu 😂',
  sk: 'Klobúk dole! Zajtra ťa doženiem 😂',
  sl: 'Kapo dol! Jutri te ujamem 😂',
  hr: 'Svaka čast! Sutra te sustižem 😂',
  da: 'Respekt! I morgen hænger jeg på 😂',
  fi: 'Respektiä! Huomenna otan kiinni 😂',
  hu: 'Le a kalappal! Holnap utolérlek 😂',
};

/** Alex's own line on the default page. Without a gendered "proud" where the language has one. */
export const SQUAD_PROUD: Record<string, string> = {
  en: 'So proud of you 🔥',
  de: 'Stolz auf dich 🔥',
  it: 'Che orgoglio, continua così 🔥',
  pl: 'Tak trzymaj 🔥',
  sv: 'Så stolt över dig 🔥',
  no: 'Så stolt av deg 🔥',
  cs: 'Jen tak dál 🔥',
  sk: 'Len tak ďalej 🔥',
  sl: 'Kar tako naprej 🔥',
  hr: 'Samo tako nastavi 🔥',
  da: 'Så stolt af dig 🔥',
  fi: 'Tosi ylpeä susta 🔥',
  hu: 'Büszke vagyok rád 🔥',
};

/** The squad members who speak, with SquadScreen's avatar colours. */
export const SQUAD_PEOPLE = {
  lea: { name: 'Lea', color: '#7C67FE' },
  oskar: { name: 'Oskar', color: '#85DBD8' },
  mila: { name: 'Mila', color: '#FD366E' },
  local: { color: '#68A3FE' },
} as const;

/** SquadScreen's demo squad. */
export const SQUAD = { name: 'Bangerz', tag: 'BNGZ' } as const;
