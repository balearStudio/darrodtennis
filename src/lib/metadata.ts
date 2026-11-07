import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "./site";

/**
 * Absolute URL for a locale-agnostic path, e.g. ("en", "/programas").
 * Always trailing-slashed to match `trailingSlash: true` in next.config.ts.
 */
export function localizedUrl(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : `${path.replace(/\/$/, "")}`;
  return `${SITE_URL}/${locale}${clean}/`;
}

/**
 * `alternates` block with a canonical for the active locale and hreflang
 * entries for every locale + x-default (design guide §4).
 */
export function buildAlternates(locale: Locale, path = "/"): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = localizedUrl(loc, path);
  }
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return { canonical: localizedUrl(locale, path), languages };
}

/**
 * Absolute URL of the locale's social card (1200x630, ~100 KB).
 *
 * Absolute on purpose: `metadataBase` is the bare origin plus the Pages project
 * path, and a root-relative value would resolve against the origin alone and
 * drop `/darrodtennis`. Regenerate the files with `scripts/make-og.mjs` when
 * the hero copy or the photo changes.
 */
export function ogImageUrl(locale: Locale): string {
  return `${SITE_URL}/images/og-${locale}.jpg`;
}

/** Shared open-graph fields. */
export function ogBase(
  locale: Locale,
  path = "/",
  alt = "Darrod Tennis Academy",
): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: "Darrod Tennis Academy",
    locale: locale === "es" ? "es_ES" : "en_GB",
    url: localizedUrl(locale, path),
    images: [{ url: ogImageUrl(locale), width: 1200, height: 630, alt }],
  };
}

/** Twitter/X card. `summary_large_image` is what renders the 1200x630 crop. */
export function twitterBase(
  locale: Locale,
  title: string,
  description: string,
  alt: string,
): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: ogImageUrl(locale), alt }],
  };
}

/**
 * Full page metadata from an explicit title + description. `path` is the
 * locale-agnostic route ("/programas"), used for canonical + hreflang.
 *
 * Always sets `twitter`: a page that leaves it out inherits the layout's, which
 * carries the homepage title and description.
 */
export async function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const alt = t("ogAlt");
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: { ...ogBase(locale, path, alt), title, description },
    twitter: twitterBase(locale, title, description, alt),
  };
}

/** Per-page metadata from a `meta.<key>` message block. */
export async function createMetadata(
  locale: Locale,
  key: string,
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata(locale, path, t(`${key}.title`), t(`${key}.description`));
}
