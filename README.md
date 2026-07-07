# Breezer landing page

Static marketing site for the Breezer snus app, live at [breezer.now](https://breezer.now). English pages at `/`, German pages at `/de/`.

**Stack:** webpack 5, Tailwind CSS 3 (via PostCSS), Swiper 14, Babel. No framework, plain HTML with build-time partials.

## Local dev

```bash
npm start
```

Regenerates the German homepage, then serves the site at `http://localhost:3000` with live reload (webpack-dev-server 6).

## Build

```bash
npm run build
```

Output goes to `build/`. The build also runs `scripts/sync-de-index.mjs` first, which generates `src/de/index.html` from `src/index.html` with translated content, so **don't edit `src/de/index.html` by hand** — edit the sync script or `src/index.html` instead.

## Deploy

Push to `main` — Vercel builds and deploys automatically using `vercel.json`:

- Build: `npm run build`
- Output: `build/`
- Universal Links: `/.well-known/apple-app-site-association` and `/.well-known/assetlinks.json` served as `application/json`

Domain: `breezer.now` in Vercel project settings → Domains.

The old GitHub Pages deploy (`npm run deploy`) is no longer used; the script and `CNAME` file remain only as a fallback.

## Project structure

```
src/
  index.html            EN homepage
  snus-tracker.html     EN subpages (quit-snus, zyn-tracker, vs-snusless, ...)
  de/                   DE pages (index.html is generated — see Build)
  partials/             Shared header/footer/schema includes (<include src="..."/>)
  js/index.js           Single JS entry (cookie consent, Swiper, WOW.js)
  css/                  Tailwind + custom styles
  .well-known/          App deep-link association files
scripts/
  sync-de-index.mjs     Generates src/de/index.html + keeps FAQ schema in sync
webpack.config.js       Builds every src/**/*.html page (except partials/demos)
```
