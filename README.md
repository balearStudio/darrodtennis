# Darrod Tennis Academy

Marketing site for Darrod Tennis Academy (Maspalomas, Gran Canaria). Bilingual
(ES default / EN), built as a **static export** and deployed to **GitHub Pages**.

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript
- **Styling:** Tailwind CSS v4, design tokens in `src/app/globals.css`
- **i18n:** `next-intl` v4, message files in `src/messages/{es,en}.json`
- **Motion:** IntersectionObserver reveals (`src/components/Reveal.tsx`) — the
  seam where GSAP / ScrollTrigger timelines drop in later
- **Design source of truth:** `design/darrod-build-guide.md` +
  `design/Darrod-Homepage.dc.html`

## Local development

```bash
npm install
npm run dev            # http://localhost:3000  (redirects to /es)
```

Other scripts:

```bash
npm run build          # static export -> ./out
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
```

> Don't run `next dev` and `next build` at the same time — Next 16 keeps
> separate output dirs and a stale `.next/dev` type file can fail the build.
> `rm -rf .next` if that happens.

## Project structure

```
src/
  app/[locale]/          every route, nested under the locale segment
    layout.tsx           root layout: fonts, <html lang>, header, footer
    page.tsx             homepage (Hero, Filosofía, Programas, Equipo, Reservar)
    programas/ equipo/ reservar/ torneos/ hoteles/ precios/ contacto/
    aviso-legal/ privacidad/ cookies/
  app/not-found.tsx      standalone 404 (served as /404.html by GitHub Pages)
  app/sitemap.ts robots.ts
  components/             SiteHeader, SiteFooter, booking/BookingMock, forms/…
  i18n/                   routing.ts, navigation.ts, request.ts
  lib/                    site.ts, content.ts, booking.ts, metadata.ts, schema.ts
  messages/es.json en.json
public/
  index.html             redirects the bare domain to /es (or /en by browser lang)
  .nojekyll              stops GitHub Pages from hiding /_next
  images/ logos/         processed from design/uploads/
```

## Content that still needs the client

- Real coach bios (placeholders in `messages/*.json` → `equipoPage.bios`)
- Legal text — `messages/*.json` → `legal.*` are **templates**; fill in the
  company name / tax ID / address and have them reviewed
- Wider action photos of group & junior sessions; a hotel-service photo
- The booking widget (`BookingMock`) is an **interactive mock** for showing the
  client the flow. To go live, follow `design/darrod-build-guide.md §7` and
  swap it for a real cal.com embed. The enquiry forms validate and show a
  success state but do not submit anywhere yet.

## Deploying to GitHub Pages

Repo: `github.com/balearStudio/darrodtennis` → served at
`https://balearstudio.github.io/darrodtennis/`.

1. **Repo Settings → Pages → Build and deployment → Source: “GitHub Actions”.**
   (Not “Deploy from a branch”.)
2. Push to `main`. `.github/workflows/deploy.yml` builds the static export and
   deploys it.

The workflow sets `NEXT_PUBLIC_BASE_PATH` from `actions/configure-pages`
(`/darrodtennis` for this repo), which is what prefixes every `/_next/*` and
image URL — the fix for the earlier 4xx on assets. If the repo is ever renamed
or moved to a custom domain, nothing needs changing: the base path is derived
at build time.

### Custom domain later

Add the domain in Settings → Pages and commit `public/CNAME` containing the
domain. `configure-pages` then reports an empty base path and the site builds
for the domain root automatically.
