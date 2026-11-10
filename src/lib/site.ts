import type { Locale } from "@/i18n/routing";

/** Canonical production URL (GitHub Pages project site). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://balearstudio.github.io/darrodtennis";

/** `/darrodtennis` in CI, empty locally. Matches next.config.ts. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const CONTACT = {
  email: "darrodtennisacademy@gmail.com",
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

/**
 * The company behind the site, for the legal notice, the privacy policy and the
 * note under each form. Taken from the old site's legal notice (Nov 2026).
 * The registered address is the old club's: confirm with the client.
 */
export const LEGAL = {
  name: "Darrod Tennis Academy S.L.",
  nif: "B01712488",
  address: "Sun Club Tennis Playa del Inglés, Avda. de Gran Canaria 118, 35100 Maspalomas, Las Palmas",
};

/** The studio that designed and built the site, credited in the footer. */
export const STUDIO = {
  email: "info@balearstudio.com",
  url: { es: "https://balearstudio.com/", en: "https://balearstudio.com/en/" },
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
