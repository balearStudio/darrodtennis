# Darrod Tennis Academy — Design & Build Guide

Reference design: `Darrod Homepage.dc.html` (homepage top-to-bottom + design-system sheet at the bottom).
This document is written to be handed to Claude Code as the single source of truth.

---

## 1. Positioning

Premium, quiet, editorial. The academy sells expertise and climate, not discounts.
Two primary audiences, in this order:

1. Competition juniors / performance players (and their parents)
2. Adult holiday players staying in Maspalomas

Tone of copy: calm, factual, first person plural. No exclamation marks, no emoji, no "¡Ven a
disfrutar!". Short declaratives. Numbers instead of adjectives ("9 torneos internacionales",
not "muchísimos torneos").

---

## 2. Art direction

- Deep olive-black backgrounds, cream type. One accent: clay orange, taken from their own courts.
- Photography stays in **colour** but is always framed darkly: `filter: saturate(.86) contrast(1.05)
  brightness(.9)` plus a top-to-bottom scrim `rgba(28,32,24,.25) → rgba(28,32,24,.75)`.
- Hairlines everywhere (1px at 12–16% opacity) as the structural device. Dashed vertical lines
  as a grid overlay on the hero only.
- Corner radius: 2px on buttons and cards, 100px on chips. Nothing else is rounded.
- No gradients as decoration, no glass, no drop shadows. Depth comes from hairlines and scrims.
- The logo is a black script lockup on transparent PNG. On dark backgrounds render with
  `filter: invert(1) brightness(1.9)`. Keep it small (44px tall in nav, 52px in footer) —
  it is delicate and should read as a signature, not a banner.

### Tokens

```
--ink-900: #14170F   base / footer
--ink-800: #1C2018   dark sections
--ink-700: #262B22   card hover
--cream:   #F4F2EA   type on dark, light section background
--cream-62: rgba(244,242,234,0.62)  body copy on dark
--cream-45: rgba(244,242,234,0.45)  micro labels on dark
--line-dark: rgba(244,242,234,0.14)
--slate:   #4A4E43   body copy on cream
--muted:   #6B6F62   labels on cream
--line-light: rgba(28,32,24,0.14)
--clay:    #C4703F   single accent
--clay-hover: #D98A5C
```

### Type

| Role | Font | Size | Tracking | Line-height |
|---|---|---|---|---|
| display | Schibsted Grotesk 400 | clamp(46px, 5.6vw, 84px) | -0.035em | 0.98 |
| h2 | Schibsted Grotesk 400 | clamp(32px, 3.6vw, 54px) | -0.03em | 1.06 |
| h3 | Schibsted Grotesk 400 | 26px | -0.02em | 1.2 |
| body | Schibsted Grotesk 400 | 17px (15px in cards) | 0 | 1.65 |
| label | IBM Plex Mono 400 | 11px uppercase | 0.22em | 1 |
| accent | Instrument Serif Italic | inherits display | -0.01em | 0.98 |

Instrument Serif italic is used **once per page maximum** — the second line of the hero headline.

### Grid & rhythm

12 columns, 24px gutter, 56px side margin desktop / 24px mobile. Sections run edge to edge.
Section padding 120px top / 130px bottom. Spacing scale: 6 · 10 · 14 · 18 · 26 · 36 · 56 · 80 · 120.
Background alternates dark → cream → dark → cream → dark → footer. Never more than the two
backgrounds plus the clay accent.

### Motion

250–300ms ease-out, on colour / border / opacity only. Section entrances: fade + 16px rise, once,
via IntersectionObserver. Respect `prefers-reduced-motion`. No parallax, no counters, no marquees.

---

## 3. Page inventory

| Page | Route | Status |
|---|---|---|
| Home | `/` | designed |
| Programas | `/programas` (+ `/programas/[slug]`) | reuse programme card + philosophy blocks |
| Equipo | `/equipo`, `/equipo/[coach]` | reuse coach grid, 3:4 portraits |
| Reservar | `/reservar` | cal.com full-page embed, same shell as homepage section |
| Torneos | `/torneos` | list: GC Yellow Bowl, Tennis Europe U14 G1, ITF Juniors, ITF World Tour M15, ITF World Tour W25, ITF Seniors Tour |
| Servicio en hoteles | `/hoteles` | partner logo wall + enquiry form |
| Precios | `/precios` | 1–4 players table, 60/80/100/120 € per hour |
| Contacto | `/contacto` | enquiry form (fields listed in §6) |
| Legal | `/aviso-legal`, `/privacidad`, `/cookies` | plain text templates |

### Homepage section order

1. Nav over hero (transparent, becomes `--ink-900` with hairline bottom on scroll)
2. Hero — aerial photo, headline, 2 CTAs, 4-stat bar
3. Filosofía — cream, statement left + 3 hairline-separated principles right
4. Programas — dark, 3 cards in a 1px hairline grid, then class-type chips + "desde 60 €/h"
5. Equipo — cream, 5 portraits 3:4
6. Reservar — dark, 3-step explainer left + cal.com embed right
7. Footer — ink-900, 4 columns, partner logo wall, legal row

---

## 4. Bilingual (ES default, EN toggle)

- ES is the default locale; routes `/` and `/en/…`. Toggle sits in the nav as `ES / EN`,
  IBM Plex Mono 11px, active in cream, inactive at 50% opacity.
- Use `next-intl` (or equivalent) with two JSON message files. Every string in §5 is keyed.
- `hreflang` alternates on all pages. Preserve the path when switching language.
- Numbers, prices and dates localised: `60 €` (ES, space before €) / `€60` (EN).

---

## 5. Copy — ES and EN

### Nav
| key | ES | EN |
|---|---|---|
| nav.academy | Academia | Academy |
| nav.programs | Programas | Programmes |
| nav.team | Equipo | Team |
| nav.tournaments | Torneos | Tournaments |
| nav.contact | Contacto | Contact |
| nav.cta | Reservar clase | Book a lesson |

### Hero
- `hero.eyebrow` — ES: Maspalomas · Gran Canaria / EN: Maspalomas · Gran Canaria
- `hero.title` — ES: Tenis los 365 días del año, *con el mejor clima del mundo.*
  EN: Tennis 365 days a year, *in the best climate in the world.*
- `hero.body` — ES: Una academia de tenis y pádel para todas las edades y niveles. Metodología
  propia, entrenadores con recorrido internacional y atención personalizada en cada sesión.
  EN: A tennis and padel academy for every age and level. Our own methodology, coaches with
  international experience, and personal attention in every session.
- `hero.cta1` — Reservar una clase / Book a lesson
- `hero.cta2` — Ver programas / See programmes
- Stats: `4 Pistas · tierra y rápida` / `4 Courts · clay and hard` — `5 Entrenadores titulados` /
  `5 Certified coaches` — `9+ Torneos internacionales` / `9+ International tournaments` —
  `desde 60 € Clase privada / hora` / `from €60 Private lesson / hour`

### Filosofía
- `phil.eyebrow` — Nuestra filosofía / Our philosophy
- `phil.title` — ES: Una metodología, cinco entrenadores, un plan para cada jugador.
  EN: One methodology, five coaches, a plan for every player.
- `phil.body` — ES: Todos los entrenadores de Darrod utilizan la misma metodología, diseñada
  exclusivamente por la academia. Durante su formación, nuestros jugadores entrenan con distintos
  entrenadores: cada profesional aporta algo personal al proceso y enriquece el juego.
  EN: Every Darrod coach works to the same methodology, designed exclusively by the academy.
  Players train with several coaches during their development: each professional brings something
  personal to the process and enriches the player's game.
- `phil.p1.title` Enfoque personalizado / A personal approach —
  `phil.p1.body` ES: Grupos reducidos por edad y nivel. Asistencia individual garantizada también
  en sesiones grupales. EN: Small groups by age and level. Individual attention guaranteed even in
  group sessions.
- `phil.p2.title` Análisis en vídeo / Video analysis —
  `phil.p2.body` ES: Estudio biomecánico y patrones de juego para diseñar el mejor plan de mejora
  técnica. EN: Biomechanical study and game patterns, used to design the best plan for technical
  improvement.
- `phil.p3.title` Ambiente competitivo / A competitive environment —
  `phil.p3.body` ES: Entrenamiento intensivo con mentalidad ganadora, dentro y fuera de la pista.
  EN: Intensive training that builds a winning mentality, on court and beyond it.

### Programas
- `prog.eyebrow` Programas / Programmes
- `prog.title` ES: Para todas las edades y todos los niveles. EN: For every age and every level.
- `prog.body` ES: Tres itinerarios, una misma metodología. Elige el punto de partida y nosotros
  construimos el camino. EN: Three paths, one methodology. Choose your starting point and we build
  the route.
- `prog.1` **Junior Tennis** · 6–18 años / 6–18 years — ES: Conocimiento de la técnica y los
  apoyos. Estudio biomecánico de cada jugador y primeros pasos en la competición. EN: Technique and
  footwork fundamentals. Biomechanical study of each player and first steps into competition.
- `prog.2` **Tennis Pro** · Competición / Competition — ES: Todas las variantes de efectos,
  estrategias de partido y patrones de juego. Psicología y preparación física adaptadas a cada
  jugador. EN: Every variation of spin, match strategy and game patterns. Psychology and physical
  preparation adapted to each player.
- `prog.3` **Coaching & Asesoramiento** · Torneos / Tournaments — ES: Acompañamiento a torneos
  locales, nacionales e internacionales, con planificación acordada con jugador y tutores.
  EN: Support at local, national and international tournaments, with a plan agreed between player
  and family.
- `prog.link` Ver programa / View programme
- Class types: Tenis privada · Tenis en grupo · Pádel privada · Pádel en grupo · Adultos
  vacacionales / Private tennis · Group tennis · Private padel · Group padel · Holiday adult groups
- `prog.from` Desde 60 € / hora — from €60 / hour

### Equipo
- `team.eyebrow` Nuestro equipo / Our team
- `team.title` ES: Entrenadores con recorrido internacional. EN: Coaches with international
  experience.
- `team.cta` Conocer al equipo / Meet the team
- Coaches: Daniel Rodríguez — Director · Head Coach; Daniel González — Entrenador · Competición /
  Coach · Competition; Laurent Dairiam — Entrenador · Tennis Pro; Javier Aníbal — Entrenador ·
  Junior; Alberto Ottchota — Entrenador · Pádel *(portrait still needed — 3:4, same light as the
  others; a striped placeholder is shown in the design)*

### Reservar
- `book.eyebrow` Reservas / Booking
- `book.title` ES: Elige tu hora. Nosotros asignamos al entrenador. EN: Choose your time. We assign
  the coach.
- `book.body` ES: Un único calendario para toda la academia. Solicitas la franja que te encaja y
  confirmamos en menos de 24 horas con el entrenador adecuado para tu nivel. EN: A single calendar
  for the whole academy. Request the slot that suits you and we confirm within 24 hours with the
  right coach for your level.
- `book.step1` Solicita franja / Request a slot — Día, hora y número de jugadores en el calendario
  de la academia. / Day, time and number of players in the academy calendar.
- `book.step2` Revisamos disponibilidad / We check availability — Cruzamos tu solicitud con los
  calendarios de los entrenadores y las pistas. / We match your request against coach and court
  calendars.
- `book.step3` Confirmación / Confirmation — Recibes email con entrenador asignado, pista y punto
  de encuentro. / You get an email with the assigned coach, court and meeting point.
- `book.submit` Solicitar clase / Request lesson
- `book.pending` Requiere confirmación / Requires confirmation

### Footer
Columns: Academia (Programas, Equipo, Filosofía, Torneos) · Servicios (Reservar clase, Servicio en
hoteles, Estancias y campus, Precios) · Contacto (Maspalomas, Gran Canaria; info@…; Instagram).
Partner label: Colaboramos con / In partnership with.
Legal row: © 2026 Darrod Tennis Academy · Aviso legal · Privacidad · Cookies.

---

## 6. Enquiry form (from the current site, keep the fields)

Nombre · Número de teléfono · Correo electrónico · Ciudad y país · Edad ·
Nivel (Bajo / Intermedio / Alto) · Inicio (date) ·
Tiempo estimado (1 semana / 15 días / 1 mes / 3 meses / Curso completo / Indefinido) ·
Horario (Mañana / Tarde) · Más información (textarea) · Acepto los Términos y Condiciones.

Styling: no boxes. Label in IBM Plex Mono 10.5px uppercase, input transparent with a 1px bottom
hairline that turns clay on focus, 16px value text. One column, max 520px.

---

## 7. cal.com integration

**Model chosen: one shared academy calendar.** The client requests a slot; Dani accepts or declines
and assigns the coach afterwards. So the event type must have **"Requires confirmation" ON**.

### cal.com setup (client side, once)

1. Team (or single) account `darrod` on cal.com.
2. Event types:
   - `clase-tenis-60` — Tennis lesson, 60 min, requires confirmation
   - `clase-tenis-90` — 90 min variant
   - `clase-padel-60` — Padel lesson
   - `coaching-torneo` — Tournament coaching, longer, requires confirmation
3. Availability = the academy's opening hours, not a single coach's. Coaches connect their own
   Google Calendars to the team so conflicts surface when Dani reviews.
4. Booking questions to add on the event type (these arrive in the confirmation email and let Dani
   assign a coach): `Nivel` (select: Bajo/Intermedio/Alto), `Número de jugadores` (1–4),
   `Edad del jugador`, `Preferencia de entrenador` (optional select), `Alojamiento / hotel`
   (optional text), `Teléfono` (required).
5. Buffers 15 min before/after; minimum notice 12 h; booking window 60 days.

### Embed (inline, themed)

Load the embed script once, then mount inline. React/Next.js:

```tsx
"use client";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function BookingEmbed({ locale = "es" }: { locale?: "es" | "en" }) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "clase-tenis-60" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          dark: {
            "cal-brand": "#C4703F",
            "cal-bg": "#20241C",
            "cal-bg-emphasis": "#262B22",
            "cal-text": "#F4F2EA",
            "cal-text-emphasis": "#F4F2EA",
            "cal-border": "rgba(244,242,234,0.16)",
            "cal-border-emphasis": "rgba(244,242,234,0.28)",
          },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      namespace="clase-tenis-60"
      calLink="darrod/clase-tenis-60"
      config={{ layout: "month_view", theme: "dark", language: locale }}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
    />
  );
}
```

Vanilla HTML equivalent: the `<script>` snippet cal.com generates under *Embed → Inline*, with the
same `cal("ui", …)` options object.

### Design rules for the embed

- Wrap it in our own frame: 1px hairline border `rgba(244,242,234,0.16)` on `#20241C`, and put our
  own header above it (event name, duration, price) so the widget doesn't have to carry branding.
- Above the frame, left: a clay dot + `cal.com · embed en línea`. Right: `Requiere confirmación`.
  Both IBM Plex Mono 10.5px uppercase, 50% cream.
- Below the frame, one line of mono micro-copy explaining the 24 h confirmation.
- The mock in `Darrod Homepage.dc.html` shows the intended visual result. cal.com's own DOM can't be
  restyled beyond the CSS variables above, so accept its internal spacing and only control the
  frame, the header, and the surrounding rhythm. If the visual gap is too large, use
  `layout: "column_view"` on narrow columns.
- Mobile: full-bleed the frame (side margin 16px), let cal.com switch to its stacked layout.

### After booking

- Webhook `BOOKING_REQUESTED` → internal notification (email + WhatsApp) to Dani with all booking
  questions, so he can assign a coach and accept in one action.
- Webhook `BOOKING_ACCEPTED` → transactional email to the client with coach name, court and meeting
  point. Template in the same type system: cream on `#14170F`, logo inverted, no images.
- Add `/reservar/gracias` page: "Solicitud recibida" + the three-step explainer, so the state is
  clear even if the email is slow.

---

## 8. Assets

In `uploads/`. All referenced by the design file.

- `aerial_shot.png` — hero. The strongest asset they have; don't crop out the clay court.
- `pro_player_1.jpg`, `pro_player_2.jpg` — programme cards, tournament pages.
- `dani with pro player.png` — coaching card.
- `dani_rodriguez_teacher.png`, `daniel_gonzalez_teacher.png`, `laurent_dairiam_teacher.png`,
  `javier_anibal_teacher.png` — coach portraits (3:4 crop).
- `darrod_logo.png` — transparent black lockup; invert on dark.
- Partner logos: 4 hotels (Gloria, Radisson Blu, Seaside Palm Beach, Seaside Sandy Beach) and 4
  institutions (RFET, Federación de Tenis de Gran Canaria, Cabildo de Gran Canaria, Instituto
  Insular de Deportes). They are full-colour JPEG/WebP; in the footer they are neutralised with
  `filter: grayscale(1) brightness(2.4) contrast(0.7); opacity:.55; mix-blend-mode: screen`.
  On a cream section, use them in original colour at 100%.

### Still needed from the client

1. Portrait of Alberto Ottchota, matching the others.
2. 3–4 wide action shots of *group* and *junior* sessions (the current set is mostly single adults).
3. One photo of the hotel service (coach on a hotel court) for `/hoteles`.
4. 2–3 short vertical videos for the hero — an autoplaying muted 6–8s loop would lift the hero
   further; the aerial still is the fallback.
5. Written testimonials (3–5) with first name + programme, for a cream testimonial band.

---

## 9. Build notes

- Next.js App Router + Tailwind is the assumed stack. Map §2 tokens to `theme.extend` rather than
  hard-coding hexes; the accent must be changeable in one place.
- Fonts via `next/font/google`: Schibsted Grotesk (400, 500), Instrument Serif (italic 400),
  IBM Plex Mono (400). Subset `latin`.
- Images through `next/image`, `sizes` set per section; hero `priority`. Serve the aerial at
  2560px max.
- Accessibility: cream on `#1C2018` passes AA; clay `#C4703F` on `#1C2018` is AA for large text
  only — never use clay for body copy, only for accents, 34px+ numerals and button fills (cream
  text on clay passes).
- SEO: Spanish primary. Target "academia de tenis Maspalomas", "clases de tenis Gran Canaria",
  "tennis lessons Gran Canaria" on the EN side. LocalBusiness + SportsActivityLocation schema.
