/**
 * Copy for the Pro page, one entry per locale.
 *
 * Kept out of `ui.ts` because it is a page's worth of prose rather than
 * interface labels, and out of the guides collection because this is a product
 * page: somebody arrives to decide, not to read.
 *
 * THE PRICES ARE HARDCODED, and nothing in either repo will catch it when they
 * drift. Checked against App Store Connect on 16.09.2026: `rc_299_1m` at
 * €2.99/month, `rc_1999_1y_1w_free` at €19.99/year, both approved, both with one
 * free week. The app reads them from RevenueCat at runtime, which reads them
 * from the stores, so there is no build-time source to derive them from. A price
 * change means editing this file, and all locales at once.
 *
 * Every limit below was read out of `react_Breezer`: FREE_IMP_COUNT = 4 of 9,
 * FREE_SYM_COUNT = 3 of 6, FREE_BUILTIN_COUNT = 9 of 24, FREE_CUSTOM_LIMIT = 1,
 * FREE_PLAYS_PER_DAY = 3, FREE_FEED_LIMIT = 6, and the referral grant of 30 days
 * for 3 invites in `functions/grant-referral-pro`. Two things people assume that
 * are wrong and are therefore said out loud on the page: the chat itself is
 * free, only photos are Pro, and drops are visible to everyone, only the rounds
 * flagged Pro need a subscription to enter.
 */
import type { Locale } from './locales';
import type { QA } from './faq';

export interface PricingCopy {
  title: string;
  heading: string;
  intro: string;
  /** The line the page is built around, in the unit the reader already buys. */
  cansLead: string;
  cansBody: string;
  plans: {
    free: { name: string; price: string; period: string; note: string; cta: string };
    pro: { name: string; price: string; period: string; second: string; save: string; trial: string; note: string; cta: string };
  };
  compareHeading: string;
  tracking: string;
  quitting: string;
  colFree: string;
  colPro: string;
  rows: { track: { label: string; free: boolean }[]; quit: { label: string; free: boolean }[] };
  limitsHeading: string;
  limitsIntro: string;
  limits: { value: string; label: string }[];
  clarify: string;
  referralHeading: string;
  referralBody: string;
  missionHeading: string;
  missionBody: string;
  ctaHeading: string;
  storeNote: string;
  faqHeading: string;
  faq: QA[];
}

export const pricing: Record<Locale, PricingCopy> = {
  en: {
    title: 'Breezer Pro vs Free: What You Get, What It Costs',
    heading: 'Pro vs Free',
    intro:
      'Logging pouches, statistics, friends, the ranking, the chat and Quit Mode all work without paying. Pro adds depth on top.',
    cansLead: 'A month of Pro costs less than half a can.',
    cansBody:
      'A can of pouches runs about €6.50. A whole year of Pro is roughly three of them — against the €1,190 a year that a can every two days actually costs.',
    plans: {
      free: {
        name: 'Free',
        price: '€0',
        period: 'forever, no trial clock',
        note: 'Everything you need to track or to quit, friends and chat included.',
        cta: 'Get the app',
      },
      pro: {
        name: 'Pro',
        price: '€2.99',
        period: 'per month',
        second: '€19.99 per year',
        save: '44% less than monthly',
        trial: 'First week free',
        note: 'The full journey, all milestones, premium statistics, unlimited games, Pro drops.',
        cta: 'Try Pro free',
      },
    },
    compareHeading: 'What each one gives you',
    tracking: 'Tracking',
    quitting: 'Quitting',
    colFree: 'Free',
    colPro: 'Pro',
    rows: {
      track: [
        { label: 'Snus counter, every brand, one tap', free: true },
        { label: 'Customised profile and daily limit', free: true },
        { label: 'Link with friends', free: true },
        { label: 'Ranking and activities', free: true },
        { label: 'Global chat', free: true },
        { label: 'Statistics for the current period', free: true },
        { label: 'Premium statistics: earlier periods, brand and strength', free: false },
        { label: 'Full snuser feed', free: false },
        { label: 'Photos in chat', free: false },
        { label: 'Drops and merch lotteries: entering Pro rounds', free: false },
        { label: 'Unlimited gaming', free: false },
      ],
      quit: [
        { label: 'Quit Mode: days snus-free, savings, pouches avoided', free: true },
        { label: 'Quitting statistics', free: true },
        { label: 'The first four health improvements', free: true },
        { label: 'Global chat and the quitting community', free: true },
        { label: 'The full quitting journey', free: false },
        { label: 'Health monitor: all nine improvements, all six symptom curves', free: false },
        { label: 'All 24 quitting achievements and unlimited goals of your own', free: false },
        { label: 'Full quitting feed', free: false },
      ],
    },
    limitsHeading: 'Where the free version ends',
    limitsIntro:
      'The generous half of this page is above. Here is the other one, with the real numbers, so nothing surprises you after you install.',
    limits: [
      { value: '4 of 9', label: 'Health improvements' },
      { value: '3 of 6', label: 'Symptom curves' },
      { value: '9 of 24', label: 'Achievements' },
      { value: '1', label: 'Goal of your own' },
      { value: '3 a day', label: 'Minigame runs' },
      { value: '6', label: 'Feed entries' },
    ],
    clarify:
      'Two things people assume and shouldn’t: the chat itself is free, only sending photos is Pro. And every drop is visible to everyone — only the rounds flagged Pro need a subscription to enter.',
    referralHeading: 'Pro without paying',
    referralBody:
      'Invite three friends who sign up and you get 30 days of full Pro. No card, nothing that renews, it ends by itself. A bigger community is worth more to this app than €2.99.',
    missionHeading: 'Why it is priced like this',
    missionBody:
      'The goal is to build the largest snus community there is, with the useful features for every kind of person in it: whoever just wants to count, whoever is cutting down, whoever is quitting, and whoever only does any of it because friends are doing it too. Breezer currently costs more to run than it earns — Pro pays for the servers and the backend, not for profit. That is why the essential half stays free instead of being rationed.',
    ctaHeading: 'Start free. Upgrade if you want more.',
    storeNote:
      'Euro prices from the App Store and Google Play, checked September 2026. Outside the euro area the stores set the local price, so exchange rates and tax can shift it. Cancel any time in the store.',
    faqHeading: 'Questions people ask before paying',
    faq: [
      {
        q: 'Is Breezer free?',
        a: 'Yes, and not in the trial sense. Logging pouches, your profile, friends, the ranking, the activity feed, the global chat and Quit Mode with its statistics all work without paying. Pro is a subscription for depth on top of that.',
      },
      {
        q: 'What does Breezer Pro cost?',
        a: '€2.99 a month or €19.99 a year, each with one free week, once per person. The yearly plan works out at €1.67 a month, 44 percent less than paying monthly. Outside the euro area the App Store and Google Play set the local price.',
      },
      {
        q: 'What do I lose without Pro?',
        a: 'Nothing you need to track or to quit. You get the first four of nine health improvements, three of six symptom curves, nine of 24 achievements, one goal of your own, three minigame runs a day, six items of the feed, and statistics for the current period. You can join a squad; creating one is Pro.',
      },
      {
        q: 'Can I get Breezer Pro without paying?',
        a: 'Yes. Invite three friends who sign up and you get 30 days of full Pro, no card involved. It is not a subscription, so it ends by itself after the 30 days.',
      },
      {
        q: 'How do I cancel Breezer Pro?',
        a: 'In the App Store or Google Play, like any other subscription, at any time. Breezer cannot cancel it for you, because the payment is handled by the store. What you paid for stays active until that period is over.',
      },
      {
        q: 'Is there a free trial?',
        a: 'One week, once per person, on both the monthly and the yearly plan. Cancel during that week and you are not charged.',
      },
    ],
  },
  de: {
    title: 'Breezer Pro vs Gratis: Was du bekommst, was es kostet',
    heading: 'Pro vs Gratis',
    intro:
      'Beutel loggen, Statistiken, Freunde, das Ranking, der Chat und der Quit-Modus funktionieren ohne Bezahlung. Pro gibt Tiefe dazu.',
    cansLead: 'Ein Monat Pro kostet weniger als eine halbe Dose.',
    cansBody:
      'Eine Dose Nikotinbeutel kostet in der Trafik rund 6,50 €. Ein ganzes Jahr Pro sind etwa drei davon — gegen die 1.190 € im Jahr, die eine Dose alle zwei Tage tatsächlich kostet.',
    plans: {
      free: {
        name: 'Gratis',
        price: '0 €',
        period: 'dauerhaft, keine ablaufende Testphase',
        note: 'Alles, was du zum Tracken oder Aufhören brauchst, Freunde und Chat inklusive.',
        cta: 'App holen',
      },
      pro: {
        name: 'Pro',
        price: '2,99 €',
        period: 'im Monat',
        second: '19,99 € im Jahr',
        save: '44 % günstiger als monatlich',
        trial: 'Erste Woche gratis',
        note: 'Die vollständige Journey, alle Meilensteine, Premium-Statistiken, unbegrenztes Spielen, Pro-Drops.',
        cta: 'Pro gratis testen',
      },
    },
    compareHeading: 'Was du wobei bekommst',
    tracking: 'Tracken',
    quitting: 'Aufhören',
    colFree: 'Gratis',
    colPro: 'Pro',
    rows: {
      track: [
        { label: 'Snus-Zähler, jede Marke, ein Tap', free: true },
        { label: 'Individuelles Profil und Tageslimit', free: true },
        { label: 'Freunde verknüpfen', free: true },
        { label: 'Ranking und Aktivitäten', free: true },
        { label: 'Globaler Chat', free: true },
        { label: 'Statistiken im aktuellen Zeitraum', free: true },
        { label: 'Premium-Statistiken: frühere Zeiträume, Marke und Stärke', free: false },
        { label: 'Vollständiger Snus-Feed', free: false },
        { label: 'Fotos im Chat', free: false },
        { label: 'Drops und Merch-Verlosungen: bei Pro-Ziehungen mitmachen', free: false },
        { label: 'Unbegrenztes Spielen', free: false },
      ],
      quit: [
        { label: 'Quit-Modus: snusfreie Tage, Ersparnis, ausgelassene Beutel', free: true },
        { label: 'Aufhör-Statistiken', free: true },
        { label: 'Die ersten vier Gesundheitsverbesserungen', free: true },
        { label: 'Globaler Chat und die Community der Aufhörenden', free: true },
        { label: 'Die vollständige Journey', free: false },
        { label: 'Gesundheitsmonitor: alle neun Verbesserungen, alle sechs Symptomverläufe', free: false },
        { label: 'Alle 24 Aufhör-Erfolge und beliebig viele eigene Ziele', free: false },
        { label: 'Vollständiger Aufhör-Feed', free: false },
      ],
    },
    limitsHeading: 'Wo die Gratisversion endet',
    limitsIntro:
      'Die großzügige Hälfte dieser Seite steht oben. Hier die andere, mit den echten Zahlen, damit nach der Installation nichts überrascht.',
    limits: [
      { value: '4 von 9', label: 'Gesundheitsverbesserungen' },
      { value: '3 von 6', label: 'Symptomverläufe' },
      { value: '9 von 24', label: 'Erfolge' },
      { value: '1', label: 'Eigenes Ziel' },
      { value: '3 am Tag', label: 'Spielrunden' },
      { value: '6', label: 'Feed-Einträge' },
    ],
    clarify:
      'Zwei Dinge, die gern angenommen werden und nicht stimmen: Der Chat selbst ist gratis, nur das Verschicken von Fotos ist Pro. Und jede Verlosung ist für alle sichtbar — nur die als Pro markierten Ziehungen brauchen ein Abo zum Mitmachen.',
    referralHeading: 'Pro ohne zu zahlen',
    referralBody:
      'Lade drei Freunde ein, die sich anmelden, und du bekommst 30 Tage volles Pro. Ohne Karte, ohne etwas, das sich verlängert, es endet von selbst. Eine größere Community ist dieser App mehr wert als 2,99 €.',
    missionHeading: 'Warum der Preis so ist',
    missionBody:
      'Das Ziel ist die größte Snus-Community, die es gibt, mit den nützlichen Funktionen für jeden Typ darin: für die, die nur zählen wollen, für die, die reduzieren, für die, die aufhören, und für alle, die das überhaupt nur machen, weil Freunde mitmachen. Breezer kostet derzeit mehr im Betrieb, als es einbringt — Pro bezahlt Server und Backend, nicht den Gewinn. Deshalb bleibt die wesentliche Hälfte gratis, statt rationiert zu werden.',
    ctaHeading: 'Gratis starten. Aufrüsten, wenn du mehr willst.',
    storeNote:
      'Euro-Preise aus App Store und Google Play, Stand September 2026. Außerhalb des Euro-Raums legen die Stores den Landespreis fest, Wechselkurse und Steuern können ihn verschieben. Jederzeit im Store kündbar.',
    faqHeading: 'Fragen, die vor dem Bezahlen kommen',
    faq: [
      {
        q: 'Ist Breezer kostenlos?',
        a: 'Ja, und nicht im Sinne einer Testphase. Beutel loggen, dein Profil, Freunde, das Ranking, der Aktivitäten-Feed, der globale Chat und der Quit-Modus mit seinen Statistiken funktionieren ohne Bezahlung. Pro ist ein Abo für die Tiefe darüber hinaus.',
      },
      {
        q: 'Was kostet Breezer Pro?',
        a: '2,99 € im Monat oder 19,99 € im Jahr, beides mit einer Gratiswoche, einmalig pro Person. Jährlich sind das 1,67 € im Monat und damit 44 Prozent weniger als monatlich. Außerhalb des Euro-Raums legen App Store und Google Play den Landespreis fest.',
      },
      {
        q: 'Was fehlt mir ohne Pro?',
        a: 'Nichts, was du zum Tracken oder Aufhören brauchst. Gratis sind die ersten vier von neun Gesundheitsverbesserungen, drei von sechs Symptomverläufen, neun von 24 Erfolgen, ein eigenes Ziel, drei Spielrunden am Tag, sechs Feed-Einträge und die Statistik im aktuellen Zeitraum. Einem Squad beitreten geht gratis, eines erstellen ist Pro.',
      },
      {
        q: 'Komme ich ohne Zahlung an Breezer Pro?',
        a: 'Ja. Lade drei Freunde ein, die sich anmelden, und du bekommst 30 Tage volles Pro, ohne Karte. Das ist kein Abo, es endet nach den 30 Tagen von selbst.',
      },
      {
        q: 'Wie kündige ich Breezer Pro?',
        a: 'Im App Store oder bei Google Play, wie jedes andere Abo, jederzeit. Breezer kann es nicht für dich kündigen, weil die Zahlung über den Store läuft. Was du bezahlt hast, bleibt bis zum Ende der Periode aktiv.',
      },
      {
        q: 'Gibt es eine Gratiswoche?',
        a: 'Eine Woche, einmalig pro Person, beim Monats- wie beim Jahresabo. Wer innerhalb dieser Woche kündigt, zahlt nichts.',
      },
    ],
  },
  sv: {
    title: 'Breezer Pro vs gratis: vad du får och vad det kostar',
    heading: 'Pro vs gratis',
    intro:
      'Logga prillor, statistik, vänner, topplistan, chatten och Quit-läget fungerar utan att betala. Pro lägger till djupet ovanpå.',
    cansLead: 'En månad Pro kostar mindre än en halv dosa.',
    cansBody:
      'En dosa nikotinportioner kostar runt 6,50 €. Ett helt år med Pro är ungefär tre dosor — mot de cirka 1 190 € per år som en dosa varannan dag faktiskt kostar.',
    plans: {
      free: {
        name: 'Gratis',
        price: '0 €',
        period: 'för alltid, ingen provperiod som tar slut',
        note: 'Allt du behöver för att tracka eller sluta, vänner och chatt inkluderat.',
        cta: 'Hämta appen',
      },
      pro: {
        name: 'Pro',
        price: '2,99 €',
        period: 'i månaden',
        second: '19,99 € per år',
        save: '44 % billigare än månadsvis',
        trial: 'Första veckan gratis',
        note: 'Hela resan, alla milstolpar, premiumstatistik, obegränsat spelande, Pro-drops.',
        cta: 'Testa Pro gratis',
      },
    },
    compareHeading: 'Vad du får i respektive',
    tracking: 'Tracking',
    quitting: 'Sluta snusa',
    colFree: 'Gratis',
    colPro: 'Pro',
    rows: {
      track: [
        { label: 'Snusräknare, alla märken, ett tryck', free: true },
        { label: 'Egen profil och dagsgräns', free: true },
        { label: 'Lägg till vänner', free: true },
        { label: 'Topplista och aktiviteter', free: true },
        { label: 'Global chatt', free: true },
        { label: 'Statistik för den aktuella perioden', free: true },
        { label: 'Premiumstatistik: tidigare perioder, märke och styrka', free: false },
        { label: 'Hela gemenskapsflödet', free: false },
        { label: 'Foton i chatten', free: false },
        { label: 'Drops och utlottningar: delta i Pro-omgångar', free: false },
        { label: 'Obegränsat spelande', free: false },
      ],
      quit: [
        { label: 'Quit-läget: snusfria dagar, sparat, uteblivna prillor', free: true },
        { label: 'Statistik för snusstoppet', free: true },
        { label: 'De första fyra hälsoförbättringarna', free: true },
        { label: 'Global chatt och gemenskapen som slutar', free: true },
        { label: 'Hela resan', free: false },
        { label: 'Hälsomonitor: alla nio förbättringar, alla sex besvärskurvor', free: false },
        { label: 'Alla 24 utmärkelser och obegränsat med egna mål', free: false },
        { label: 'Hela sluta-flödet', free: false },
      ],
    },
    limitsHeading: 'Var gratisversionen tar slut',
    limitsIntro:
      'Den generösa halvan står ovanför. Här är den andra, med de verkliga siffrorna, så att ingenting överraskar efter installationen.',
    limits: [
      { value: '4 av 9', label: 'Hälsoförbättringar' },
      { value: '3 av 6', label: 'Besvärskurvor' },
      { value: '9 av 24', label: 'Utmärkelser' },
      { value: '1', label: 'Eget mål' },
      { value: '3 per dag', label: 'Spelomgångar' },
      { value: '6', label: 'Flödesposter' },
    ],
    clarify:
      'Två saker som brukar antas och inte stämmer: chatten i sig är gratis, bara foton är Pro. Och varje drop syns för alla — bara omgångarna märkta Pro kräver prenumeration för att delta.',
    referralHeading: 'Pro utan att betala',
    referralBody:
      'Bjud in tre vänner som registrerar sig och du får 30 dagar med fullt Pro. Inget kort, ingenting som förnyas, det tar slut av sig självt.',
    missionHeading: 'Därför ser priset ut så här',
    missionBody:
      'Målet är att bygga den största snuscommunityn som finns, med de användbara funktionerna för varje typ av person i den: den som bara vill räkna, den som trappar ner, den som slutar, och den som gör något av det bara för att vännerna gör det. Breezer kostar just nu mer i drift än det drar in — Pro betalar servrarna och backend, inte vinsten.',
    ctaHeading: 'Börja gratis. Uppgradera om du vill ha mer.',
    storeNote:
      'Europriser från App Store och Google Play, kontrollerade i september 2026. Utanför euroområdet sätter butikerna lokalpriset. Säg upp när som helst i butiken.',
    faqHeading: 'Frågor som kommer före betalningen',
    faq: [
      {
        q: 'Är Breezer gratis?',
        a: 'Ja, och inte som en provperiod. Logga prillor, profilen, vänner, topplistan, aktivitetsflödet, den globala chatten och Quit-läget med statistiken fungerar utan att betala. Pro är en prenumeration för djupet ovanpå.',
      },
      {
        q: 'Vad kostar Breezer Pro?',
        a: '2,99 € i månaden eller 19,99 € per år, båda med en gratis vecka, en gång per person. Årsplanen blir 1,67 € i månaden, 44 procent mindre än månadsvis. Utanför euroområdet sätter App Store och Google Play lokalpriset.',
      },
      {
        q: 'Vad förlorar jag utan Pro?',
        a: 'Inget du behöver för att tracka eller sluta. Du får de första fyra av nio hälsoförbättringar, tre av sex besvärskurvor, nio av 24 utmärkelser, ett eget mål, tre spelomgångar per dag, sex poster i flödet och statistik för den aktuella perioden.',
      },
      {
        q: 'Kan jag få Pro utan att betala?',
        a: 'Ja. Bjud in tre vänner som registrerar sig så får du 30 dagar med fullt Pro, utan kort. Det är ingen prenumeration, den tar slut av sig själv efter 30 dagar.',
      },
      {
        q: 'Hur säger jag upp Breezer Pro?',
        a: 'I App Store eller Google Play, som vilken prenumeration som helst, när som helst. Breezer kan inte säga upp den åt dig eftersom betalningen sköts av butiken.',
      },
      {
        q: 'Finns det en gratis provperiod?',
        a: 'En vecka, en gång per person, på både månads- och årsplanen. Säger du upp under veckan debiteras du inget.',
      },
    ],
  },
};
