import type { Locale } from "@/i18n/routing";
import { CONTACT, SITE_URL } from "./site";
import { localizedUrl } from "./metadata";

/**
 * Stable node ids, so every page's JSON-LD points at the same academy and
 * website entities instead of describing a fresh one each time.
 */
const ACADEMY_ID = `${SITE_URL}/#academy`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const NAME = "Darrod Tennis Academy";

/**
 * LocalBusiness + SportsActivityLocation schema (design guide §9).
 *
 * `telephone` switches on with `CONTACT.phone` in site.ts. Keep it, the
 * address and the Google Business Profile identical — consistent name /
 * address / phone is what local search matches on.
 */
export function businessSchema(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "LocalBusiness"],
    "@id": ACADEMY_ID,
    name: NAME,
    description,
    url: localizedUrl(locale, "/"),
    logo: `${SITE_URL}/darrod-logo.png`,
    image: `${SITE_URL}/images/club-courts.jpg`,
    email: CONTACT.email,
    ...(CONTACT.phone ? { telephone: CONTACT.phone.replace(/\s+/g, "") } : {}),
    sameAs: [CONTACT.instagram],
    address: {
      "@type": "PostalAddress",
      addressLocality: CONTACT.locality,
      addressRegion: CONTACT.region,
      addressCountry: CONTACT.country,
    },
    areaServed: { "@type": "Place", name: "Gran Canaria" },
    sport: ["Tennis", "Padel"],
  };
}

/** WebSite node — what Google reads the site name in results from. */
export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: NAME,
    alternateName: "Darrod Tennis",
    url: `${SITE_URL}/`,
    inLanguage: locale,
    publisher: { "@id": ACADEMY_ID },
  };
}

/**
 * BreadcrumbList for a page. `trail` excludes the homepage, which is always
 * the first crumb; the last entry is the current page.
 */
export function breadcrumbSchema(
  locale: Locale,
  homeLabel: string,
  trail: { name: string; path: string }[],
) {
  const crumbs = [{ name: homeLabel, path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: localizedUrl(locale, c.path),
    })),
  };
}

/** Coach profile page. */
export function personSchema(
  locale: Locale,
  coach: { slug: string; name: string; role: string; bio: string; image: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${localizedUrl(locale, `/equipo/${coach.slug}`)}#person`,
    name: coach.name,
    jobTitle: coach.role,
    description: coach.bio,
    image: `${SITE_URL}${coach.image}`,
    url: localizedUrl(locale, `/equipo/${coach.slug}`),
    worksFor: { "@id": ACADEMY_ID },
  };
}

/** Programme page, as a service the academy provides. */
export function serviceSchema(
  locale: Locale,
  program: { slug: string; name: string; description: string; image: string },
  serviceType: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: program.name,
    serviceType,
    description: program.description,
    image: `${SITE_URL}${program.image}`,
    url: localizedUrl(locale, `/programas/${program.slug}`),
    provider: { "@id": ACADEMY_ID },
    areaServed: { "@type": "Place", name: "Gran Canaria" },
  };
}
