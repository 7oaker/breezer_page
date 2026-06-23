# Breezer landing page

## Local dev

```bash
npm start
```

## Build

```bash
npm run build
```

Output goes to `build/`.

## Deploy (Vercel)

Push to `main` — Vercel builds automatically using `vercel.json`:

- Build: `npm run build`
- Output: `build/`
- Universal Links: `/.well-known/apple-app-site-association` (served as `application/json`)

Domain: `breezer.now` in Vercel project settings → Domains.

## Deploy (GitHub Pages, legacy)

```bash
npm run deploy
```
