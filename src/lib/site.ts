import type { Locale } from "@/i18n/routing";

/** Canonical production URL (GitHub Pages project site). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://balearstudio.github.io/darrodtennis";

/** `/darrodtennis` in CI, empty locally. Matches next.config.ts. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const CONTACT = {
  email: "info@darrodtennisacademy.com",
  /**
   * Phone / WhatsApp are still pending from the client. Fill both and the links
   * switch on across the footer, the contact page and the header:
   *   phone    — display string, e.g. "+34 928 00 00 00"
   *   whatsapp — the same number, digits only with country code, e.g. "34928000000"
   */
  phone: "",
  whatsapp: "",
  instagram: "https://www.instagram.com/darrodtennisacademy/",
  locality: "Maspalomas",
  region: "Las Palmas",
  country: "ES",
};

/** `tel:` href with spaces stripped; empty string when no number is set. */
export const telHref = CONTACT.phone
  ? `tel:${CONTACT.phone.replace(/\s+/g, "")}`
  : "";

/** wa.me deep link; empty string when no number is set. */
export const whatsappHref = CONTACT.whatsapp
  ? `https://wa.me/${CONTACT.whatsapp}`
  : "";

/** Primary navigation. `href` is locale-agnostic; <Link> adds the prefix. */
export const NAV_LINKS = [
  { key: "academy", href: "/#filosofia" },
  { key: "programs", href: "/programas" },
  { key: "team", href: "/equipo" },
  { key: "tournaments", href: "/torneos" },
  { key: "contact", href: "/contacto" },
] as const;

export const LOCALE_LABELS: Record<Locale, string> = {
  es: "ES",
  en: "EN",
};
