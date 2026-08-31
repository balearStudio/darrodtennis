import type { Locale } from "@/i18n/routing";
import { CONTACT, SITE_URL } from "./site";
import { localizedUrl } from "./metadata";

/** LocalBusiness + SportsActivityLocation schema (design guide §9). */
export function businessSchema(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "LocalBusiness"],
    name: "Darrod Tennis Academy",
    description,
    url: localizedUrl(locale, "/"),
    image: `${SITE_URL}/images/aerial.jpg`,
    email: CONTACT.email,
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
