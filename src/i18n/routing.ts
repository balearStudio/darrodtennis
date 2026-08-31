import { defineRouting } from "next-intl/routing";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // The site is a static export (GitHub Pages) with no middleware to rewrite
  // `/` -> `/es`, so every locale carries its prefix. `public/index.html`
  // redirects the bare domain to `/es/`.
  localePrefix: "always",
  // We keep identical pathnames across locales (`/es/programas`,
  // `/en/programas`) so switching language always preserves the current path.
  localeDetection: false,
});
