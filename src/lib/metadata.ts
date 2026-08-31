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

/** Shared open-graph fields. */
export function ogBase(locale: Locale, path = "/"): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: "Darrod Tennis Academy",
    locale: locale === "es" ? "es_ES" : "en_GB",
    url: localizedUrl(locale, path),
  };
}

/**
 * Per-page metadata from a `meta.<key>` message block. `path` is the
 * locale-agnostic route ("/programas"), used for canonical + hreflang.
 */
export async function createMetadata(
  locale: Locale,
  key: string,
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: { ...ogBase(locale, path), title, description },
  };
}
