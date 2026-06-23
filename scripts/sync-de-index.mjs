import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'src/index.html'), 'utf8');

const headDe = `    <meta name="description" content="Breezer ist die soziale Snus App: Konsum tracken, Rankings, Freunde und Quit-Modus. Kostenloser Snus Tracker für iOS und Android." />
    <meta name="keywords" content="snus app, snus tracker, snus app österreich, snus tracking, snus community, snus rankings, snus aufhören, zyn tracker, Breezer app" />
    <meta name="author" content="Breezer Team" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://breezer.now/de/" />
    <link rel="alternate" hreflang="en" href="https://breezer.now/" />
    <link rel="alternate" hreflang="de-AT" href="https://breezer.now/de/" />
    <link rel="alternate" hreflang="de" href="https://breezer.now/de/" />
    <link rel="alternate" hreflang="x-default" href="https://breezer.now/de/" />
    <include src="../partials/language-router-head.html" />
    <meta property="og:title" content="BREEZER: ULTIMATE SNUS APP" />
    <meta property="og:description" content="Tracke deinen Snus-Konsum, bleib in Kontrolle, tritt global an und spare Geld. Die smarte, soziale Snus App." />
    <meta property="og:url" content="https://breezer.now/de/" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://breezer.now/images/og-image.png" />
    <meta property="og:site_name" content="Breezer: Ultimate Snus App" />
    <meta property="og:locale" content="de_AT" />
    <meta property="og:locale:alternate" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="BREEZER: DIE ULTIMATIVE SNUS APP" />
    <meta name="twitter:description" content="Snus tracken, mit Freunden ranken, Geld sparen und Teil der ersten sozialen Snus Community werden." />
    <meta name="twitter:image" content="https://breezer.now/images/og-image.png" />
    <meta name="twitter:site" content="@breezerapp" />
    <meta name="google-site-verification" content="bwKXk7Y2z1UH9uVey_xx8RvpBl3cFq4OClKifDmF0ms" />
    <title>BREEZER: ULTIMATE SNUS APP</title>
<!-- Google Analytics is loaded only after cookie consent (see cookie banner). -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://breezer.now/#website",
          "url": "https://breezer.now",
          "name": "Breezer",
          "inLanguage": ["en", "de-AT"],
          "publisher": { "@id": "https://breezer.now/#organization" }
        },
        {
          "@type": "Organization",
          "@id": "https://breezer.now/#organization",
          "name": "Breezer",
          "url": "https://breezer.now",
          "logo": "https://breezer.now/images/logo/logo.svg",
          "email": "info@breezer.now",
          "sameAs": [
            "https://www.instagram.com/breezer.now",
            "https://www.tiktok.com/@breezerapp",
            "https://apps.apple.com/at/app/breezer/id6737725511",
            "https://play.google.com/store/apps/details?id=com.breezerapp.breezer"
          ]
        },
        {
          "@type": "MobileApplication",
          "@id": "https://breezer.now/#app",
          "name": "Breezer",
          "alternateName": ["Breezer Snus App", "Breezer Snus Tracker"],
          "operatingSystem": "iOS, Android",
          "applicationCategory": "LifestyleApplication",
          "applicationSubCategory": "Health & Fitness",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          },
          "url": "https://breezer.now/de/",
          "downloadUrl": [
            "https://apps.apple.com/at/app/breezer/id6737725511",
            "https://play.google.com/store/apps/details?id=com.breezerapp.breezer&hl=de_AT"
          ],
          "installUrl": "https://breezer.now/invite/",
          "description": "Breezer: Der ultimative Snus Tracker mit Freunden, Rankings und Belohnungen.",
          "image": "https://breezer.now/images/og-image.png",
          "screenshot": "https://breezer.now/images/og-image.png",
          "inLanguage": ["de-AT", "en"],
          "featureList": [
            "Snus Tracking und Statistiken",
            "Globale und lokale Rankings",
            "Freunde und Community",
            "Quit-Modus mit Gesundheits-Tracking",
            "Exklusive Aktionen und Rewards",
            "Echtzeit-Benachrichtigungen",
            "Visuelle Statistiken und Charts",
            "Erfolge und Meilensteine"
          ],
          "author": { "@id": "https://breezer.now/#organization" },
          "publisher": { "@id": "https://breezer.now/#organization" }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Was ist die beste Snus App?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Breezer ist die erste soziale Snus App mit Tracking, Rankings, Freunden und Quit-Modus. Kostenlos für iOS und Android."
              }
            },
            {
              "@type": "Question",
              "name": "Ist Breezer kostenlos?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ja, der Download ist kostenlos. Breezer Pro ist optional als In-App-Abo verfügbar."
              }
            },
            {
              "@type": "Question",
              "name": "Kann Breezer beim Snus aufhören helfen?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ja. Der Quit-Modus trackt Entzug, Gesundheitsmeilensteine, Ersparnis und Streaks."
              }
            }
          ]
        }
      ]
    }
    </script>`;

let de = src.replace('<html lang="en"', '<html lang="de-AT"');

// Replace head meta block (from description through schema script)
de = de.replace(
  /    <meta name="description"[\s\S]*?    <\/script>\n    <script>\n      \/\/ Force dark mode/,
  `${headDe}\n    <script>\n      // Force dark mode`
);

// Asset and page paths for /de/ output
de = de.replace(/src="images\//g, 'src="../images/');
de = de.replace(/<include src="partials\//g, '<include src="../partials/');
de = de.replace(/href="index\.html"/g, 'href="/de/"');
de = de.replace(/href="privacy-policy/g, 'href="../privacy-policy');
de = de.replace(/href="eula\.html"/g, 'href="../eula.html"');

// Nav labels
de = de.replace(/>\s*About\s*</g, '>Über uns<');
de = de.replace(/>\s*How It Works\s*</g, '>So funktioniert\'s<');

// Major section headings and all visible copy (longest strings first)
const translationMap = [
  ["Whether you're seeking support, have feedback, or are interested in collaborating with us, please fill out the form below or write us a mail to", 'Ob du Support brauchst, Feedback hast oder mit uns zusammenarbeiten willst: Fülle das Formular aus oder schreib uns an'],
  ['Breezer makes snus tracking simple and social. Log your usage, compete on leaderboards, unlock exclusive promotions, and grow together with a global snus community — all in one app.', 'Breezer macht Snus-Tracking einfach und sozial. Logge deinen Konsum, tritt in Rankings an, sichere dir exklusive Aktionen und wachse mit einer globalen Snus-Community - alles in einer App.'],
  ["Breezer's Quitting Mode supports your health journey step by step. Track symptoms, celebrate milestones, monitor savings, and stay motivated with powerful tools designed to help you quit for good.", 'Breezers Quit-Modus begleitet dich Schritt für Schritt. Tracke Symptome, feiere Meilensteine, behalte Ersparnisse im Blick und bleib motiviert mit Tools, die dir beim Aufhören helfen.'],
  ['Tell us why you reach out, we will answer quickly!', 'Sag uns kurz, worum es geht - wir melden uns schnell!'],
  ['Hear from our amazing users who have rated Breezer already.', 'Das sagen Nutzer, die Breezer schon bewertet haben.'],
  ['Discover many more inside the app - and more to come!', 'Entdecke noch viel mehr in der App - und es kommt laufend dazu!'],
  ['Quick-track your snus and see quitting wins without unlocking.', 'Snus schnell tracken und Quit-Erfolge sehen, ohne zu entsperren.'],
  ['Advanced analytics with beautiful visual charts', 'Erweiterte Analysen mit schönen Visualisierungen'],
  ['Connect and share your journey with friends', 'Verbinde dich und teile deine Journey mit Freunden'],
  ['Compete on leaderboards and track activities', 'Tritt in Rankings an und tracke Aktivitäten'],
  ['See when your friends take snus in real-time', 'Sieh in Echtzeit, wenn Freunde Snus nehmen'],
  ['Get verified partner discounts and giveaways', 'Sichere dir verifizierte Partner-Rabatte und Giveaways'],
  ['Track your progress with detailed quitting metrics', 'Verfolge deinen Fortschritt mit detaillierten Quit-Metriken'],
  ['Monitor your health improvements over time', 'Beobachte deine Gesundheitsverbesserungen über die Zeit'],
  ['Unlock badges and celebrate your milestones', 'Schalte Badges frei und feiere deine Meilensteine'],
  ['By clicking contact us button, you agree our terms and policy,', 'Mit Klick auf Kontakt stimmst du unseren AGB und Richtlinien zu,'],
  ['Track Smarter. Save More. Connect Globally.', 'Smarter tracken. Mehr sparen. Global vernetzen.'],
  ['Quit Easier. Feel Better. Stay Motivated.', 'Leichter aufhören. Besser fühlen. Motiviert bleiben.'],
  ['Download Breezer Now &amp; Get started for free.', 'Jetzt Breezer downloaden und kostenlos starten.'],
  ['Download Breezer Now & Get started for free.', 'Jetzt Breezer downloaden und kostenlos starten.'],
  ['All in one app from snuser for snuser - Join the Community and have fun!', 'Die All-in-one App von Snusern für Snuser. Werde Teil der Community und hab Spaß!'],
  ['Ready to track snus with friends?', 'Bereit, Snus mit Freunden zu tracken?'],
  ['Boost your Lifestyle with the', 'Steigere deinen Lifestyle mit der'],
  ['TRACKING, PROMOTIONS & COMMUNITY', 'TRACKING, AKTIONEN & COMMUNITY'],
  ['QUITTING & HEALTH JOURNEY', 'AUFHÖREN & GESUNDHEITSREISE'],
  ['Premium Tracking & Charts', 'Premium Tracking & Charts'],
  ['Link with Friends', 'Mit Freunden verbinden'],
  ['Ranking and Activities', 'Rankings und Aktivitäten'],
  ['Smart Notifications', 'Smarte Benachrichtigungen'],
  ['Exclusive Promotions', 'Exklusive Aktionen'],
  ['Quitting Statistics', 'Quit-Statistiken'],
  ['Health Monitor', 'Gesundheits-Monitor'],
  ['Widget - One tap control', 'Widget - Steuerung mit einem Tipp'],
  ['Download Breezer for IOS or Android', 'Breezer für iOS oder Android downloaden'],
  ['Easy sign in with Google or email', 'Einfach mit Google oder E-Mail anmelden'],
  ['Start tracking and ranking together', 'Gemeinsam tracken und ranken'],
  ['Add Friends, Enjoy', 'Freunde hinzufügen, loslegen'],
  ['Install the App', 'App installieren'],
  ["What Breezer's Say", 'Was Breezer-Nutzer sagen'],
  ["Let's get in Touch", 'Kontakt aufnehmen'],
  ['App Screenshots', 'App Screenshots'],
  ['Sign in', 'Anmelden'],
  ['Quitting', 'Aufhören'],
  ['Tracking', 'Tracking'],
  ['Contact Us', 'Kontakt'],
  ['Comapy (optioanl)', 'Firma (optional)'],
  ['Cookie settings', 'Cookie-Einstellungen'],
  ['Privacy Policy Website', 'Datenschutz Website'],
  ['Privacy Policy App', 'Datenschutz App'],
  ['Terms and conditions', 'AGB'],
  ['&copy; 2025 Breezer. All rights reserved', '&copy; 2025 Breezer. Alle Rechte vorbehalten'],
  ['How It Works', 'So funktioniert\'s'],
  ['About', 'Über uns'],
  ['England', 'England'],
  ['Austria', 'Österreich'],
  ['Sweden', 'Schweden'],
  ['Get it on', 'Jetzt bei'],
  ['Download from', 'Download im'],
  // Image alt text
  ['alt="Breezer App - Press Snus"', 'alt="Breezer App - Snus tracken"'],
  ['alt="About Breezer - Premium Statistics"', 'alt="Breezer - Premium Statistiken"'],
  ['alt="About Breezer - Ranking with Friends"', 'alt="Breezer - Rankings mit Freunden"'],
  ['alt="Breezer tracking widget on lockscreen"', 'alt="Breezer Tracking-Widget auf dem Sperrbildschirm"'],
  ['alt="Breezer tracking widget quick action"', 'alt="Breezer Tracking-Widget Schnellaktion"'],
  ['alt="Breezer quitting widget on lockscreen"', 'alt="Breezer Quit-Widget auf dem Sperrbildschirm"'],
  ['alt="Breezer quitting widget savings view"', 'alt="Breezer Quit-Widget Ersparnis-Ansicht"'],
  ['alt="Mobile Frame for Breezer App Screenshots"', 'alt="Smartphone-Rahmen für Breezer App Screenshots"'],
];

for (const [en, deText] of translationMap) {
  de = de.split(en).join(deText);
}

// Multi-line contact disclaimer (split across lines in HTML)
de = de.replace(
  /By clicking contact us button, you agree our terms and\s+policy,/g,
  'Mit Klick auf Kontakt stimmst du unseren AGB und Richtlinien zu,'
);

de = de.replace(
  /https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.breezerapp\.breezer"/g,
  'https://play.google.com/store/apps/details?id=com.breezerapp.breezer&hl=de_AT"'
);

de = de.replace(
  /https:\/\/apps\.apple\.com\/at\/app\/breezer\/id6737725511\?l=en-GB/g,
  'https://apps.apple.com/at/app/breezer/id6737725511?l=de'
);

fs.writeFileSync(path.join(root, 'src/de/index.html'), de);

const leftover = [
  'Ready to track', 'Boost your', 'Track Smarter', 'Quit Easier', 'Contact Us',
  'Hear from our', 'Whether you', 'By clicking contact', 'All rights reserved',
  'Get it on', 'Download from', 'How It Works', 'Premium Tracking',
  'Smart Notifications', 'Quitting Statistics', 'Tell us why',
];
const missing = leftover.filter((s) => de.includes(s));
if (missing.length) {
  console.warn('Warning: possible untranslated strings:', missing.join(', '));
} else {
  console.log('Translation check passed.');
}
console.log('Wrote src/de/index.html from English template');
