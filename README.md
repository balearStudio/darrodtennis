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
- The booking widget's **availability** is still a deterministic mock — the grid
  of free/taken slots is derived from the date, not from a real calendar. The
  request itself is real and arrives by email (see below); to show live
  availability, follow `design/darrod-build-guide.md §7` and swap the calendar
  for a cal.com embed.
- The enquiry forms on `/contacto` and `/hoteles` (`forms/EnquiryForm`) still
  validate and show a success state without submitting anywhere.

## The booking request email

`/reservar` (and the homepage widget) collects the visitor's name, email,
country, phone with an international dial code, a free-text comment, and **any
number of day + time combinations**, then sends the lot as a structured email.

There is no server — the site is a static export — so the browser POSTs the
request to [Web3Forms](https://web3forms.com), which relays it to the academy
inbox. Setup, once:

1. Get a free access key at <https://web3forms.com> for
   `info@darrodtennisacademy.com` (the address in `src/lib/site.ts`).
2. Locally, put it in `.env.local` (git-ignored):

   ```bash
   NEXT_PUBLIC_WEB3FORMS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

3. For the deployed site, add it as a repo secret named `WEB3FORMS_KEY`
   (Settings → Secrets and variables → Actions). `deploy.yml` already passes it
   to the build.

The key is public by design — it only authorises "send mail to the address this
key is bound to" — but it lives in an env var so it stays out of the repo.

**With no key configured** (a fresh clone, a preview build) nothing breaks: the
form falls back to opening the visitor's own mail client with the same
structured body pre-filled. The wiring is in `src/lib/bookingRequest.ts`; to
move to Formspree or a real backend later, that one file is the seam.

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
